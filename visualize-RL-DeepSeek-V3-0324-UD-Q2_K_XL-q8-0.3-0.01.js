// 概念解释数据
const concepts = {
    "agent": {
        "title": "Agent (智能体)",
        "description": "Agent 是强化学习系统中的决策者，它通过与环境交互来学习最优行为策略。Agent 接收环境的当前状态，决定采取什么动作，然后从环境中获得奖励反馈。",
        "animation": function(container) {
            // 创建agent动画
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 添加agent图标
            const agent = svg.append("circle")
                .attr("cx", 150)
                .attr("cy", 200)
                .attr("r", 40)
                .attr("fill", "#e74c3c");
            
            // 添加眼睛
            svg.append("circle")
                .attr("cx", 140)
                .attr("cy", 190)
                .attr("r", 5)
                .attr("fill", "white");
            svg.append("circle")
                .attr("cx", 160)
                .attr("cy", 190)
                .attr("r", 5)
                .attr("fill", "white");
            
            // 添加文字
            svg.append("text")
                .attr("x", 150)
                .attr("y", 220)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text("Agent");
            
            // 动画效果
            agent.transition()
                .duration(1000)
                .attr("cx", 350)
                .transition()
                .duration(1000)
                .attr("cx", 150)
                .on("end", function() {
                    d3.select(this).transition()
                        .attr("fill", "#f1c40f")
                        .transition()
                        .attr("fill", "#e74c3c");
                });
        }
    },
    "environment": {
        "title": "Environment (环境)",
        "description": "Environment 是 Agent 所处的外部世界，它接收 Agent 的动作并返回新的状态和奖励。环境可以是物理世界、游戏、模拟系统等。",
        "animation": function(container) {
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 创建环境背景
            svg.append("rect")
                .attr("x", 50)
                .attr("y", 50)
                .attr("width", 400)
                .attr("height", 300)
                .attr("fill", "#2ecc71")
                .attr("rx", 10)
                .attr("ry", 10);
            
            // 添加环境元素
            svg.append("circle")
                .attr("cx", 100)
                .attr("cy", 100)
                .attr("r", 20)
                .attr("fill", "#3498db");
            
            svg.append("rect")
                .attr("x", 200)
                .attr("y", 150)
                .attr("width", 50)
                .attr("height", 80)
                .attr("fill", "#e67e22");
                
            svg.append("text")
                .attr("x", 250)
                .attr("y", 200)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text("Environment");
            
            // 动画效果
            svg.selectAll("*")
                .transition()
                .duration(1000)
                .attr("opacity", 0.5)
                .transition()
                .duration(1000)
                .attr("opacity", 1);
        }
    },
    "state": {
        "title": "State (状态)",
        "description": "State 表示环境在某一时刻的特定情况或配置。它是 Agent 做出决策的基础，包含了 Agent 需要知道的所有信息。",
        "animation": function(container) {
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 创建状态表示
            const states = [
                {x: 100, y: 150, color: "#3498db", text: "S₁"},
                {x: 200, y: 150, color: "#e74c3c", text: "S₂"},
                {x: 300, y: 150, color: "#2ecc71", text: "S₃"}
            ];
            
            states.forEach(state => {
                svg.append("circle")
                    .attr("cx", state.x)
                    .attr("cy", state.y)
                    .attr("r", 30)
                    .attr("fill", state.color);
                
                svg.append("text")
                    .attr("x", state.x)
                    .attr("y", state.y)
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .text(state.text);
            });
            
            // 动画效果 - 状态转换
            const agent = svg.append("circle")
                .attr("cx", 100)
                .attr("cy", 220)
                .attr("r", 15)
                .attr("fill", "#f1c40f");
            
            agent.transition()
                .duration(1000)
                .attr("cx", 200)
                .transition()
                .duration(1000)
                .attr("cx", 300)
                .transition()
                .duration(1000)
                .attr("cx", 100);
        }
    },
    "action": {
        "title": "Action (动作)",
        "description": "Action 是 Agent 在特定状态下可以采取的行为。动作空间可以是离散的(如上下左右)或连续的(如方向盘角度)。",
        "animation": function(container) {
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 创建动作箭头
            const actions = [
                {x1: 150, y1: 200, x2: 200, y2: 150, text: "上", color: "#3498db"},
                {x1: 150, y1: 200, x2: 200, y2: 250, text: "下", color: "#e74c3c"},
                {x1: 150, y1: 200, x2: 100, y2: 200, text: "左", color: "#2ecc71"},
                {x1: 150, y1: 200, x2: 250, y2: 200, text: "右", color: "#f1c40f"}
            ];
            
            // 添加Agent中心点
            svg.append("circle")
                .attr("cx", 150)
                .attr("cy", 200)
                .attr("r", 20)
                .attr("fill", "#9b59b6");
                
            // 添加动作箭头
            actions.forEach(action => {
                const arrow = svg.append("line")
                    .attr("x1", action.x1)
                    .attr("y1", action.y1)
                    .attr("x2", action.x2)
                    .attr("y2", action.y2)
                    .attr("stroke", action.color)
                    .attr("stroke-width", 3)
                    .attr("marker-end", "url(#arrow)");
                
                svg.append("text")
                    .attr("x", (action.x1 + action.x2)/2)
                    .attr("y", (action.y1 + action.y2)/2)
                    .attr("text-anchor", "middle")
                    .attr("fill", action.color)
                    .text(action.text);
            });
            
            // 定义箭头标记
            svg.append("defs").append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#999");
            
            // 动画效果 - 高亮不同动作
            let i = 0;
            function highlightAction() {
                const action = actions[i % actions.length];
                svg.selectAll("line")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1);
                
                svg.select(`line[x1='${action.x1}'][y1='${action.y1}'][x2='${action.x2}'][y2='${action.y2}']`)
                    .attr("stroke", action.color)
                    .attr("stroke-width", 5);
                
                i++;
                setTimeout(highlightAction, 1000);
            }
            highlightAction();
        }
    },
    "reward": {
        "title": "Reward (奖励)",
        "description": "Reward 是环境对 Agent 采取动作的即时反馈信号。Agent 的目标是最大化长期累积奖励。奖励可以是正数(鼓励)或负数(惩罚)。",
        "animation": function(container) {
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 创建奖励场景
            const agent = svg.append("circle")
                .attr("cx", 100)
                .attr("cy", 200)
                .attr("r", 20)
                .attr("fill", "#3498db");
                
            const coin = svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 200)
                .attr("r", 15)
                .attr("fill", "#f1c40f");
                
            // 添加文字
            svg.append("text")
                .attr("x", 100)
                .attr("y", 230)
                .attr("text-anchor", "middle")
                .text("Agent");
                
            svg.append("text")
                .attr("x", 300)
                .attr("y", 230)
                .attr("text-anchor", "middle")
                .text("+10");
            
            // 动画效果 - Agent移动获取奖励
            agent.transition()
                .duration(1500)
                .attr("cx", 300)
                .attr("cy", 200)
                .on("end", function() {
                    // 奖励效果
                    coin.transition()
                        .attr("r", 0)
                        .remove();
                    
                    // 显示奖励文本
                    const rewardText = svg.append("text")
                        .attr("x", 300)
                        .attr("y", 180)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "24px")
                        .attr("fill", "#f1c40f")
                        .text("+10")
                        .attr("opacity", 0);
                        
                    rewardText.transition()
                        .attr("opacity", 1)
                        .transition()
                        .delay(500)
                        .attr("opacity", 0)
                        .remove();
                    
                    // Agent返回
                    agent.transition()
                        .delay(1000)
                        .duration(1500)
                        .attr("cx", 100)
                        .attr("cy", 200);
                });
        }
    },
    "policy": {
        "title": "Policy (策略)",
        "description": "Policy 定义了 Agent 在给定状态下选择动作的方式。策略可以是确定性的(状态到动作的映射)或随机性的(状态到动作概率分布的映射)。",
        "animation": function(container) {
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 创建策略表
            const states = [
                {x: 100, y: 100, name: "S₁"},
                {x: 100, y: 150, name: "S₂"},
                {x: 100, y: 200, name: "S₃"}
            ];
            
            const actions = ["上", "下", "左", "右"];
            
            // 绘制状态
            states.forEach(state => {
                svg.append("circle")
                    .attr("cx", state.x)
                    .attr("y", state.y)
                    .attr("r", 20)
                    .attr("fill", "#3498db");
                
                svg.append("text")
                    .attr("x", state.x)
                    .attr("y", state.y)
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .text(state.name);
            });
            
            // 绘制策略箭头
            states.forEach(state => {
                actions.forEach((action, i) => {
                    const angle = Math.random() * Math.PI * 2;
                    const length = 50 + Math.random() * 30;
                    const x2 = state.x + Math.cos(angle) * length;
                    const y2 = state.y + Math.sin(angle) * length;
                    
                    const arrow = svg.append("line")
                        .attr("x1", state.x)
                        .attr("y1", state.y)
                        .attr("x2", x2)
                        .attr("y2", y2)
                        .attr("stroke", "#e74c3c")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0.7)
                        .attr("marker-end", "url(#arrow)");
                    
                    // 随机概率
                    const prob = Math.random().toFixed(1);
                    if (Math.random() > 0.3) {
                        svg.append("text")
                            .attr("x", (state.x + x2)/2)
                            .attr("y", (state.y + y2)/2)
                            .attr("text-anchor", "middle")
                            .attr("font-size", "10px")
                            .attr("fill", "#e74c3c")
                            .text(prob);
                    }
                });
            });
            
            // 定义箭头标记
            svg.append("defs").append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#e74c3c");
            
            // 动画效果 - 高亮不同策略
            let i = 0;
            function highlightPolicy() {
                const state = states[i % states.length];
                svg.selectAll("line")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.3);
                
                svg.selectAll(`line[x1='${state.x}']`)
                    .attr("stroke-width", 3)
                    .attr("opacity", 0.9);
                
                i++;
                setTimeout(highlightPolicy, 1500);
            }
            highlightPolicy();
        }
    },
    "value-function": {
        "title": "Value Function (价值函数)",
        "description": "Value Function 表示从某个状态开始，遵循特定策略所能获得的期望累积奖励。它帮助 Agent 评估状态的好坏，指导长期决策。",
        "animation": function(container) {
            const svg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
            
            // 创建状态价值网格
            const gridSize = 5;
            const cellSize = 60;
            const padding = 50;
            
            // 生成随机价值
            const values = [];
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    values.push({
                        x: padding + j * cellSize,
                        y: padding + i * cellSize,
                        value: (Math.random() * 10).toFixed(1)
                    });
                }
            }
            
            // 绘制网格
            values.forEach(cell => {
                // 根据价值设置颜色
                const colorScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range(["#e74c3c", "#2ecc71"]);
                
                svg.append("rect")
                    .attr("x", cell.x - cellSize/2)
                    .attr("y", cell.y - cellSize/2)
                    .attr("width", cellSize)
                    .attr("height", cellSize)
                    .attr("fill", colorScale(cell.value))
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1);
                
                svg.append("text")
                    .attr("x", cell.x)
                    .attr("y", cell.y)
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .text(cell.value);
            });
            
            // 动画效果 - 价值传播
            function propagateValue() {
                const center = values[Math.floor(gridSize * gridSize / 2)];
                
                // 从中心向外传播
                const wave = svg.append("circle")
                    .attr("cx", center.x)
                    .attr("cy", center.y)
                    .attr("r", 5)
                    .attr("fill", "none")
                    .attr("stroke", "#f1c40f")
                    .attr("stroke-width", 2)
                    .attr("opacity", 1);
                
                wave.transition()
                    .attr("r", cellSize * gridSize / 2)
                    .attr("opacity", 0)
                    .duration(2000)
                    .on("end", function() {
                        wave.remove();
                        setTimeout(propagateValue, 500);
                    });
            }
            propagateValue();
        }
    }
};

// 初始化页面
document.addEventListener("DOMContentLoaded", function() {
    const panel = document.getElementById("explanation-panel");
    const visualization = document.getElementById("visualization-area");
    
    // 为每个概念卡片添加点击事件
    document.querySelectorAll(".concept-card").forEach(card => {
        card.addEventListener("click", function() {
            const conceptId = this.id;
            
            // 高亮当前选中的卡片
            document.querySelectorAll(".concept-card").forEach(c => {
                c.classList.remove("active");
            });
            this.classList.add("active");
            
            // 显示解释和动画
            const concept = concepts[conceptId];
            panel.style.display = "block";
            panel.innerHTML = `
                <h2>${concept.title}</h2>
                <p>${concept.description}</p>
            `;
            
            // 清除之前的可视化
            visualization.innerHTML = "";
            
            // 创建新的可视化
            concept.animation(visualization);
        });
    });
    
    // 默认显示第一个概念
    document.getElementById("agent").click();
});