document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('rlCanvas');
    const ctx = canvas.getContext('2d');
    const conceptBtns = document.querySelectorAll('.concept-btn');
    const explanations = document.querySelectorAll('.explanation');
    
    // 默认显示概述
    document.getElementById('overview').classList.add('active');
    
    // 概念按钮点击事件
    conceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const concept = this.dataset.concept;
            
            // 更新按钮状态
            conceptBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新解释内容
            explanations.forEach(exp => exp.classList.remove('active'));
            document.getElementById(concept).classList.add('active');
            
            // 更新可视化
            updateVisualization(concept);
        });
    });
    
    // 强化学习环境模拟
    const env = {
        width: canvas.width,
        height: canvas.height,
        agent: { x: 50, y: 150, size: 20, color: '#3498db' },
        target: { x: 700, y: 150, size: 20, color: '#2ecc71' },
        obstacles: [
            { x: 200, y: 100, width: 50, height: 100, color: '#e74c3c' },
            { x: 400, y: 150, width: 50, height: 100, color: '#e74c3c' }
        ],
        policy: function(state) {
            // 简单策略：向右移动，避开障碍
            if (state.agentX > 200 && state.agentX < 250 && state.agentY < 200) {
                return { dx: 0, dy: 5 }; // 向下避开障碍
            }
            if (state.agentX > 400 && state.agentX < 450 && state.agentY > 150) {
                return { dx: 0, dy: -5 }; // 向上避开障碍
            }
            return { dx: 5, dy: 0 }; // 默认向右
        },
        getReward: function(agent, target) {
            const distance = Math.sqrt(Math.pow(agent.x - target.x, 2) + Math.pow(agent.y - target.y, 2));
            if (distance < 10) return 10; // 到达目标
            for (const obs of this.obstacles) {
                if (agent.x > obs.x && agent.x < obs.x + obs.width &&
                    agent.y > obs.y && agent.y < obs.y + obs.height) {
                    return -10; // 碰到障碍
                }
            }
            return -0.1; // 每步小惩罚
        }
    };
    
    // 动画状态
    let animationId = null;
    let currentConcept = 'overview';
    let agentPath = [];
    let valueMap = {};
    
    // 初始化价值图
    for (let x = 0; x < env.width; x += 20) {
        for (let y = 0; y < env.height; y += 20) {
            const distToTarget = Math.sqrt(Math.pow(x - env.target.x, 2) + Math.pow(y - env.target.y, 2));
            valueMap[`${x},${y}`] = 100 - distToTarget;
        }
    }
    
    // 更新可视化
    function updateVisualization(concept) {
        currentConcept = concept;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        drawFrame();
    }
    
    // 绘制帧
    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制目标
        ctx.fillStyle = env.target.color;
        ctx.fillRect(env.target.x - env.target.size/2, env.target.y - env.target.size/2, env.target.size, env.target.size);
        
        // 绘制障碍
        ctx.fillStyle = '#e74c3c';
        env.obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        // 根据当前概念绘制不同内容
        switch(currentConcept) {
            case 'agent':
                drawAgent();
                break;
            case 'environment':
                drawEnvironment();
                break;
            case 'state':
                drawState();
                break;
            case 'action':
                drawActions();
                break;
            case 'reward':
                drawRewards();
                break;
            case 'policy':
                drawPolicy();
                break;
            case 'value':
                drawValueFunction();
                break;
            default:
                drawOverview();
                break;
        }
        
        animationId = requestAnimationFrame(drawFrame);
    }
    
    // 绘制Agent
    function drawAgent() {
        ctx.fillStyle = env.agent.color;
        ctx.fillRect(env.agent.x - env.agent.size/2, env.agent.y - env.agent.size/2, env.agent.size, env.agent.size);
        
        // 移动Agent
        const state = { agentX: env.agent.x, agentY: env.agent.y };
        const action = env.policy(state);
        env.agent.x += action.dx;
        env.agent.y += action.dy;
        
        // 边界检查
        if (env.agent.x < 0) env.agent.x = 0;
        if (env.agent.x > env.width) env.agent.x = env.width;
        if (env.agent.y < 0) env.agent.y = 0;
        if (env.agent.y > env.height) env.agent.y = env.height;
        
        // 记录路径
        agentPath.push({ x: env.agent.x, y: env.agent.y });
        if (agentPath.length > 50) agentPath.shift();
        
        // 绘制路径
        ctx.beginPath();
        ctx.moveTo(agentPath[0].x, agentPath[0].y);
        for (let i = 1; i < agentPath.length; i++) {
            ctx.lineTo(agentPath[i].x, agentPath[i].y);
        }
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // 绘制环境
    function drawEnvironment() {
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(0, 0, env.width, env.height);
        
        // 绘制目标
        ctx.fillStyle = env.target.color;
        ctx.fillRect(env.target.x - env.target.size/2, env.target.y - env.target.size/2, env.target.size, env.target.size);
        
        // 绘制障碍
        ctx.fillStyle = '#e74c3c';
        env.obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        // 绘制Agent
        ctx.fillStyle = env.agent.color;
        ctx.fillRect(env.agent.x - env.agent.size/2, env.agent.y - env.agent.size/2, env.agent.size, env.agent.size);
    }
    
    // 绘制状态
    function drawState() {
        drawAgent();
        
        // 绘制状态信息
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`当前状态: (${Math.floor(env.agent.x)}, ${Math.floor(env.agent.y)})`, 10, 20);
        
        // 绘制感知范围
        ctx.beginPath();
        ctx.arc(env.agent.x, env.agent.y, 50, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // 绘制动作
    function drawActions() {
        drawAgent();
        
        // 绘制可能的动作
        const actions = [
            { dx: 0, dy: -5, label: '上' },
            { dx: 0, dy: 5, label: '下' },
            { dx: -5, dy: 0, label: '左' },
            { dx: 5, dy: 0, label: '右' }
        ];
        
        actions.forEach(action => {
            ctx.beginPath();
            ctx.moveTo(env.agent.x, env.agent.y);
            ctx.lineTo(env.agent.x + action.dx * 5, env.agent.y + action.dy * 5);
            ctx.strokeStyle = '#9b59b6';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = '#9b59b6';
            ctx.fillText(action.label, env.agent.x + action.dx * 5, env.agent.y + action.dy * 5);
        });
    }
    
    // 绘制奖励
    function drawRewards() {
        drawAgent();
        
        // 计算奖励
        const reward = env.getReward(env.agent, env.target);
        
        // 显示奖励
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`当前奖励: ${reward.toFixed(1)}`, 10, 20);
        
        // 如果到达目标或碰到障碍，重置Agent位置
        if (Math.abs(reward) >= 10) {
            env.agent.x = 50;
            env.agent.y = 150;
        }
    }
    
    // 绘制策略
    function drawPolicy() {
        drawAgent();
        
        // 显示当前策略决策
        const state = { agentX: env.agent.x, agentY: env.agent.y };
        const action = env.policy(state);
        
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`策略决策: (${action.dx}, ${action.dy})`, 10, 20);
        
        // 绘制策略方向
        ctx.beginPath();
        ctx.moveTo(env.agent.x, env.agent.y);
        ctx.lineTo(env.agent.x + action.dx * 5, env.agent.y + action.dy * 5);
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // 绘制价值函数
    function drawValueFunction() {
        // 绘制价值热图
        for (let x = 0; x < env.width; x += 20) {
            for (let y = 0; y < env.height; y += 20) {
                const value = valueMap[`${x},${y}`];
                const alpha = Math.min(1, Math.max(0, value / 100));
                ctx.fillStyle = `rgba(46, 204, 113, ${alpha})`;
                ctx.fillRect(x, y, 20, 20);
            }
        }
        
        // 绘制其他元素
        drawEnvironment();
    }
    
    // 绘制概述
    function drawOverview() {
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(0, 0, env.width, env.height);
        
        // 绘制强化学习流程图
        const centerX = env.width / 2;
        const centerY = env.height / 2;
        
        // Agent
        ctx.fillStyle = env.agent.color;
        ctx.fillRect(centerX - 100, centerY - 20, 40, 40);
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText('Agent', centerX - 90, centerY + 5);
        
        // Environment
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 200, centerY - 100, 400, 200);
        ctx.fillStyle = 'black';
        ctx.fillText('Environment', centerX - 50, centerY - 80);
        
        // 箭头和标签
        drawArrow(centerX - 60, centerY, centerX - 20, centerY, 'Action');
        drawArrow(centerX + 20, centerY, centerX + 60, centerY, 'State, Reward');
        
        // 绘制策略和价值函数图标
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(centerX - 180, centerY + 30, 30, 30);
        ctx.fillStyle = 'black';
        ctx.fillText('Policy', centerX - 175, centerY + 50);
        
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(centerX + 150, centerY + 30, 30, 30);
        ctx.fillStyle = 'black';
        ctx.fillText('Value', centerX + 155, centerY + 50);
    }
    
    // 绘制箭头
    function drawArrow(fromX, fromY, toX, toY, label) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 箭头头部
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();
        
        // 标签
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(label, (fromX + toX) / 2 - 20, (fromY + toY) / 2 - 10);
    }
    
    // 初始绘制
    drawFrame();
});