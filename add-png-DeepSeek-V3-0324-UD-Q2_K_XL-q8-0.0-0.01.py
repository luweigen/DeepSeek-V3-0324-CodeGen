# Prerequisites:
# pip install torch
# pip install docling_core
# pip install transformers
# sudo apt install poppler-utils
# pip install pypdf

import time
import os
import torch
from docling_core.types.doc import DoclingDocument
from docling_core.types.doc.document import DocTagsDocument
from transformers import AutoProcessor, AutoModelForVision2Seq
from transformers.image_utils import load_image
from pathlib import Path

def get_compute_capability(device:torch.device = None):
    if torch.cuda.is_available():
        if device is None:
            num_gpus = torch.cuda.device_count()
            min_compute_capability_major = 100
            for gpu_id in range(num_gpus):
                gpu_props = torch.cuda.get_device_properties(gpu_id)
                min_compute_capability_major = min(min_compute_capability_major, gpu_props.major)
            return min_compute_capability_major
        else:
            return torch.cuda.get_device_properties(device).major
    return 0

import io
import subprocess
from typing import List
from PIL import Image
from pypdf import PdfReader

def get_pdf_media_box_width_height(local_pdf_path: str, page_num: int) -> tuple[float, float]:
    """
    Get the MediaBox dimensions for a specific page in a PDF file using the pdfinfo command.

    :param pdf_file: Path to the PDF file
    :param page_num: The page number for which to extract MediaBox dimensions
    :return: A dictionary containing MediaBox dimensions or None if not found
    """
    # Construct the pdfinfo command to extract info for the specific page
    command = ["pdfinfo", "-f", str(page_num), "-l", str(page_num), "-box", "-enc", "UTF-8", local_pdf_path]

    # Run the command using subprocess
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # Check if there is any error in executing the command
    if result.returncode != 0:
        raise ValueError(f"Error running pdfinfo: {result.stderr}")

    # Parse the output to find MediaBox
    output = result.stdout

    for line in output.splitlines():
        if "MediaBox" in line:
            media_box_str: List[str] = line.split(":")[1].strip().split()
            media_box: List[float] = [float(x) for x in media_box_str]
            return abs(media_box[0] - media_box[2]), abs(media_box[3] - media_box[1])

    raise ValueError("MediaBox not found in the PDF info.")


def render_pdf_to_image(local_pdf_path: str, page_num: int, target_longest_image_dim: int = 2048) -> Image.Image:
    longest_dim = max(get_pdf_media_box_width_height(local_pdf_path, page_num))

    # Convert PDF page to PNG using pdftoppm
    pdftoppm_result = subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-f",
            str(page_num),
            "-l",
            str(page_num),
            "-r",
            str(target_longest_image_dim * 72 / longest_dim),  # 72 pixels per point is the conversion factor
            local_pdf_path,
        ],
        timeout=120,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    assert pdftoppm_result.returncode == 0, pdftoppm_result.stderr
    return Image.open(io.BytesIO((pdftoppm_result.stdout)))

import argparse

# Parse command line arguments
parser = argparse.ArgumentParser(description='Process a document file (PDF, JPG, or PNG) and convert it to docling format.')
parser.add_argument('file_path', type=str, help='Path to the file to process (PDF, JPG, or PNG)')
parser.add_argument("--device", type=str, help="Device to use (cpu or cuda)")
args = parser.parse_args()

# Use provided device if specified, otherwise check for CUDA
if args.device:
    DEVICE = args.device
else:
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize processor and model
processor = AutoProcessor.from_pretrained("ds4sd/SmolDocling-256M-preview")
model = AutoModelForVision2Seq.from_pretrained(
    "ds4sd/SmolDocling-256M-preview",
    torch_dtype=torch.bfloat16,
    _attn_implementation="flash_attention_2" if DEVICE == "cuda" and get_compute_capability()>=8 else "eager",
).to(DEVICE)

file_path = args.file_path
file_extension = os.path.splitext(file_path)[1].lower()

if file_extension == '.pdf':
    # Process PDF file
    reader = PdfReader(file_path)
    num_pages = len(reader.pages)
    print(f"Total pages in PDF: {num_pages}")

    for pg_num in range(1, num_pages + 1):
        print(f"Processing page {pg_num} of {num_pages}")
        image = render_pdf_to_image(file_path, pg_num, target_longest_image_dim=1024)
        process_image(image)
elif file_extension in ('.jpg', '.jpeg', '.png'):
    # Process image file
    print(f"Processing image file: {file_path}")
    image = load_image(file_path)
    process_image(image)
else:
    raise ValueError(f"Unsupported file format: {file_extension}. Please provide a PDF, JPG, or PNG file.")

def process_image(image):
    # Create input messages
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": "Convert this page to docling."}
            ]
        },
    ]

    start_time = time.time()
    # Prepare inputs
    prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
    inputs = processor(text=prompt, images=[image], return_tensors="pt")
    inputs = inputs.to(DEVICE)
    end_time = time.time()
    print(f"Prepare inputs took {end_time - start_time:.2f} s")

    start_time = time.time()
    # Generate outputs
    generated_ids = model.generate(**inputs, max_new_tokens=8192)
    end_time = time.time()
    prompt_length = inputs.input_ids.shape[1]
    trimmed_generated_ids = generated_ids[:, prompt_length:]
    doctags = processor.batch_decode(
        trimmed_generated_ids,
        skip_special_tokens=False,
    )[0].lstrip()

    # Populate document
    doctags_doc = DocTagsDocument.from_doctags_and_image_pairs([doctags], [image])
    print(doctags)
    # create a docling document
    doc = DoclingDocument(name="Document")
    doc.load_from_doctags(doctags_doc)

    # export as any format
    # HTML
    # output_path_html = Path("Out/") / "example.html"
    # doc.save_as_html(output_filoutput_path_htmle_path)
    # MD
    print(doc.export_to_markdown())
    print('='*20)
    print(f"Generation on {DEVICE} took {end_time - start_time:.2f} s")