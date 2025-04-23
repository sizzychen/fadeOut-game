document.addEventListener('DOMContentLoaded', () => {
    // 游戏状态变量
    const boardSize = 9; // 9x9棋盘，适合初学者
    let currentLesson = 1;
    let totalLessons = 7;
    let board = []; // 存储棋盘状态
    let selectedStoneColor = 'black'; // 默认选择黑棋
    let lessonCompleted = false;
    let currentTask = null;
    
    // DOM元素
    const boardGrid = document.getElementById('boardGrid');
    const progressBar = document.getElementById('progressBar');
    const lessonTitle = document.getElementById('lessonTitle');
    const lessonContent = document.getElementById('lessonContent');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const retryBtn = document.getElementById('retryBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stoneSelection = document.getElementById('stoneSelection');
    const lessonCompleteSection = document.getElementById('lessonComplete');
    const restartBtn = document.getElementById('restartBtn');
    
    // 初始化游戏
    const initGame = () => {
        // 初始化棋盘状态
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        
        // 创建棋盘格线
        createBoardGrid();
        
        // 更新进度条
        updateProgressBar();
        
        // 设置第一课
        setupLesson(1);
        
        // 添加事件监听器
        setupEventListeners();
    };
    
    // 创建棋盘格线和交叉点
    const createBoardGrid = () => {
        boardGrid.innerHTML = '';
        
        // 创建水平线
        for (let i = 0; i < boardSize; i++) {
            const horizontalLine = document.createElement('div');
            horizontalLine.className = 'grid-line horizontal-line';
            horizontalLine.style.top = `${(i / (boardSize - 1)) * 100}%`;
            boardGrid.appendChild(horizontalLine);
        }
        
        // 创建垂直线
        for (let i = 0; i < boardSize; i++) {
            const verticalLine = document.createElement('div');
            verticalLine.className = 'grid-line vertical-line';
            verticalLine.style.left = `${(i / (boardSize - 1)) * 100}%`;
            boardGrid.appendChild(verticalLine);
        }
        
        // 创建星位点（9x9棋盘上有5个星位点）
        const starPoints = [
            {x: 2, y: 2}, {x: 2, y: 6},
            {x: 4, y: 4},
            {x: 6, y: 2}, {x: 6, y: 6}
        ];
        
        starPoints.forEach(point => {
            const starPoint = document.createElement('div');
            starPoint.className = 'star-point';
            starPoint.style.left = `${(point.x / (boardSize - 1)) * 100}%`;
            starPoint.style.top = `${(point.y / (boardSize - 1)) * 100}%`;
            boardGrid.appendChild(starPoint);
        });
        
        // 创建交叉点（用于放置棋子）
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                const intersection = document.createElement('div');
                intersection.className = 'intersection';
                intersection.dataset.x = x;
                intersection.dataset.y = y;
                intersection.style.gridColumn = `${x + 1}`;
                intersection.style.gridRow = `${y + 1}`;
                
                // 添加点击事件
                intersection.addEventListener('click', () => handleIntersectionClick(x, y));
                
                boardGrid.appendChild(intersection);
            }
        }
    };
    
    // 处理交叉点点击事件
    const handleIntersectionClick = (x, y) => {
        // 如果当前课程已完成，不处理点击
        if (lessonCompleted) return;
        
        // 检查该位置是否已有棋子
        if (board[y][x] !== null) return;
        
        // 根据当前课程处理点击
        switch (currentLesson) {
            case 1:
                // 第一课：放置棋子
                placeStone(x, y, selectedStoneColor);
                showFeedback('success', '太棒了！这就是围棋的基本操作！');
                lessonCompleted = true;
                nextBtn.disabled = false;
                break;
                
            case 2:
                // 第二课：理解"气"的概念
                // 检查是否点击了中央黑子周围的"气"
                const centerX = 4;
                const centerY = 4;
                const isAdjacent = (
                    (x === centerX && Math.abs(y - centerY) === 1) ||
                    (y === centerY && Math.abs(x - centerX) === 1)
                );
                
                if (isAdjacent) {
                    placeStone(x, y, 'white');
                    showFeedback('success', '很好！白棋减少了黑棋的一口气哦！围棋就是通过减少对方的气来吃掉棋子。');
                    lessonCompleted = true;
                    nextBtn.disabled = false;
                } else {
                    showFeedback('error', '请在黑棋周围的绿色"气"上放置白棋。');
                }
                break;
                
            case 3:
                // 第三课：提子
                // 检查是否点击了黑子最后的气
                if (x === 4 && y === 3) {
                    placeStone(x, y, 'white');
                    // 提走黑子
                    setTimeout(() => {
                        removeStone(4, 4);
                        showFeedback('success', '你成功提走了黑棋！这就是围棋的基本规则之一。提走棋子后，被提的棋子会从棋盘上移除。');
                        lessonCompleted = true;
                        nextBtn.disabled = false;
                    }, 500);
                } else {
                    showFeedback('error', '请在黑棋最后的气上放置白棋。');
                }
                break;
                
            case 4:
                // 第四课：围地
                // 检查是否在正确的位置放置黑棋以完成围地
                if (currentTask && currentTask.validPositions.some(pos => pos.x === x && pos.y === y)) {
                    placeStone(x, y, 'black');
                    currentTask.placedStones.push({x, y});
                    
                    // 检查是否完成了围地任务
                    if (currentTask.placedStones.length >= currentTask.requiredStones) {
                        // 显示围地效果
                        showTerritory('black', currentTask.territory);
                        showFeedback('success', '你完成了围地！围地越多，得分越高哦！');
                        lessonCompleted = true;
                        nextBtn.disabled = false;
                    }
                } else {
                    showFeedback('error', '请尝试在高亮提示的位置放置黑棋，完成围地。');
                }
                break;
                
            case 5:
                // 第五课：劫争
                // 检查是否尝试在劫争位置放置棋子
                if (x === 4 && y === 3) {
                    showFeedback('error', '这是劫争，不能马上在这个位置放子。试试放在其他地方吧！');
                } else {
                    placeStone(x, y, selectedStoneColor);
                    showFeedback('success', '你学会了围棋的禁忌规则，真厉害！');
                    lessonCompleted = true;
                    nextBtn.disabled = false;
                }
                break;
                
            case 6:
                // 第六课：死活棋
                // 检查是否在正确的位置放置黑棋以形成"两个眼"
                if (currentTask && currentTask.validPositions.some(pos => pos.x === x && pos.y === y)) {
                    placeStone(x, y, 'black');
                    currentTask.placedStones.push({x, y});
                    
                    // 检查是否完成了"两个眼"的任务
                    if (currentTask.placedStones.length >= currentTask.requiredStones) {
                        showFeedback('success', '太棒了！你学会了如何让自己的棋子活下来！有两个"眼"的棋子是活棋，不会被提走。');
                        lessonCompleted = true;
                        nextBtn.disabled = false;
                    }
                } else {
                    showFeedback('error', '请尝试在高亮提示的位置放置黑棋，形成"两个眼"。');
                }
                break;
                
            case 7:
                // 第七课：综合练习
                // 简单的AI对弈
                placeStone(x, y, 'black');
                
                // AI回应
                setTimeout(() => {
                    const aiMove = getAIMove();
                    if (aiMove) {
                        placeStone(aiMove.x, aiMove.y, 'white');
                    }
                }, 500);
                
                // 检查是否已经下了足够多的棋子
                currentTask.moveCount++;
                if (currentTask.moveCount >= currentTask.requiredMoves) {
                    showFeedback('success', `你围了${countTerritory('black')}个地，提走了${currentTask.capturedStones}个子，表现很棒！继续加油！`);
                    lessonCompleted = true;
                    nextBtn.disabled = false;
                }
                break;
        }
    };
    
    // 放置棋子
    const placeStone = (x, y, color) => {
        // 更新棋盘状态
        board[y][x] = color;
        
        // 创建棋子DOM元素
        const stone = document.createElement('div');
        stone.className = `stone ${color}`;
        stone.id = `stone-${x}-${y}`;
        
        // 找到对应的交叉点并添加棋子
        const intersection = document.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
        intersection.appendChild(stone);
        
        // 如果是第7课，检查是否有棋子被提走
        if (currentLesson === 7) {
            checkCaptures(x, y, color);
        }
    };
    
    // 移除棋子
    const removeStone = (x, y) => {
        // 更新棋盘状态
        board[y][x] = null;
        
        // 移除棋子DOM元素
        const stone = document.getElementById(`stone-${x}-${y}`);
        if (stone) {
            stone.remove();
        }
    };
    
    // 显示"气"
    const showLiberties = (x, y) => {
        const libertyPositions = [
            {x: x, y: y - 1}, // 上
            {x: x + 1, y: y}, // 右
            {x: x, y: y + 1}, // 下
            {x: x - 1, y: y}  // 左
        ];
        
        libertyPositions.forEach(pos => {
            // 检查位置是否在棋盘内且没有棋子
            if (pos.x >= 0 && pos.x < boardSize && pos.y >= 0 && pos.y < boardSize && board[pos.y][pos.x] === null) {
                const liberty = document.createElement('div');
                liberty.className = 'liberty';
                liberty.id = `liberty-${pos.x}-${pos.y}`;
                
                const intersection = document.querySelector(`.intersection[data-x="${pos.x}"][data-y="${pos.y}"]`);
                intersection.appendChild(liberty);
            }
        });
    };
    
    // 移除所有"气"显示
    const removeLiberties = () => {
        const liberties = document.querySelectorAll('.liberty');
        liberties.forEach(liberty => liberty.remove());
    };
    
    // 高亮显示特定位置
    const highlightPosition = (x, y) => {
        const highlight = document.createElement('div');
        highlight.className = 'highlight';
        highlight.id = `highlight-${x}-${y}`;
        
        const intersection = document.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
        intersection.appendChild(highlight);
    };
    
    // 移除所有高亮显示
    const removeHighlights = () => {
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach(highlight => highlight.remove());
    };
    
    // 显示领地/围地
    const showTerritory = (color, positions) => {
        positions.forEach(pos => {
            const territory = document.createElement('div');
            territory.className = `territory ${color}`;
            territory.id = `territory-${pos.x}-${pos.y}`;
            
            const intersection = document.querySelector(`.intersection[data-x="${pos.x}"][data-y="${pos.y}"]`);
            intersection.appendChild(territory);
        });
    };
    
    // 移除所有领地/围地显示
    const removeTerritories = () => {
        const territories = document.querySelectorAll('.territory');
        territories.forEach(territory => territory.remove());
    };
    
    // 显示反馈信息
    const showFeedback = (type, message) => {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback-message ${type}`;
        
        // 3秒后自动隐藏
        setTimeout(() => {
            feedbackMessage.className = 'feedback-message';
        }, 3000);
    };
    
    // 更新进度条
    const updateProgressBar = () => {
        const progress = (currentLesson - 1) / totalLessons * 100;
        progressBar.style.width = `${progress}%`;
    };
    
    // 设置课程内容
    const setupLesson = (lessonNumber) => {
        // 重置状态
        lessonCompleted = false;
        nextBtn.disabled = true;
        clearBoard();
        removeLiberties();
        removeHighlights();
        removeTerritories();
        
        // 更新当前课程
        currentLesson = lessonNumber;
        
        // 更新进度条
        updateProgressBar();
        
        switch (lessonNumber) {
            case 1:
                // 第一课：认识棋盘和棋子
                lessonTitle.textContent = '第一步：认识棋盘和棋子';
                lessonContent.innerHTML = `
                    <p>这是围棋棋盘，格子上的交叉点是棋子的落点。</p>
                    <p>围棋有两种棋子：黑棋和白棋。黑棋先下哦！</p>
                    <p>请选择黑棋，然后点击棋盘上的任意交叉点放置棋子。</p>
                `;
                stoneSelection.style.display = 'flex';
                break;
                
            case 2:
                // 第二课：什么是"气"
                lessonTitle.textContent = '第二步：什么是"气"';
                lessonContent.innerHTML = `
                    <p>围棋中有一个重要的概念叫做"气"。</p>
                    <p>"气"是棋子周围的空位，帮助棋子存活。</p>
                    <p>试试在黑棋的"气"上放一个白棋，看看会发生什么。</p>
                `;
                
                // 在棋盘中央放置一个黑棋
                placeStone(4, 4, 'black');
                
                // 显示黑棋的"气"
                showLiberties(4, 4);
                
                // 自动选择白棋
                selectStone('white');
                stoneSelection.style.display = 'none';
                break;
                
            case 3:
                // 第三课：提子
                lessonTitle.textContent = '第三步：提子（吃掉棋子）';
                lessonContent.innerHTML = `
                    <p>当一个棋子的所有"气"都被对方占领，这个棋子就会被提走（吃掉）。</p>
                    <p>黑棋现在只剩一口气了，试试用白棋占领它最后的气，看看会发生什么。</p>
                `;
                
                // 放置一个黑棋和三个白棋
                placeStone(4, 4, 'black');
                placeStone(3, 4, 'white');
                placeStone(5, 4, 'white');
                placeStone(4, 5, 'white');
                
                // 高亮显示黑棋最后的气
                highlightPosition(4, 3);
                
                // 自动选择白棋
                selectStone('white');
                stoneSelection.style.display = 'none';
                break;
                
            case 4:
                // 第四课：围地
                lessonTitle.textContent = '第四步：围地';
                lessonContent.innerHTML = `
                    <p>围棋的目标是围住更多的空地。</p>
                    <p>试试用黑棋围住一个区域，看看能不能让它变成你的"地"。</p>
                    <p>请在高亮的位置放置黑棋，完成围地。</p>
                `;
                
                // 设置围地任务
                currentTask = {
                    validPositions: [
                        {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3},
                        {x: 3, y: 4}, {x: 5, y: 4},
                        {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}
                    ],
                    placedStones: [],
                    requiredStones: 8,
                    territory: [{x: 4, y: 4}]
                };
                
                // 高亮显示可以放置棋子的位置
                currentTask.validPositions.forEach(pos => {
                    highlightPosition(pos.x, pos.y);
                });
                
                // 自动选择黑棋
                selectStone('black');
                stoneSelection.style.display = 'none';
                break;
                
            case 5:
                // 第五课：劫争
                lessonTitle.textContent = '第五步：基本禁忌（劫争）';
                lessonContent.innerHTML = `
                    <p>围棋有一个特别的规则，叫做"劫争"。</p>
                    <p>如果你刚刚提走对方的棋子，不能马上回到原来的位置哦！</p>
                    <p>试试在高亮位置放子，你会发现这是不允许的。然后尝试在其他位置放子。</p>
                `;
                
                // 设置劫争局面
                placeStone(4, 4, 'black');
                placeStone(3, 4, 'white');
                placeStone(5, 4, 'white');
                placeStone(4, 5, 'white');
                placeStone(4, 2, 'black');
                
                // 假设白棋刚刚提走了黑棋
                removeStone(4, 3);
                
                // 高亮显示劫争位置
                highlightPosition(4, 3);
                
                // 自动选择黑棋
                selectStone('black');
                stoneSelection.style.display = 'none';
                break;
                
            case 6:
                // 第六课：死活棋
                lessonTitle.textContent = '第六步：死活棋';
                lessonContent.innerHTML = `
                    <p>在围棋中，如果你的棋子有两个"眼"，就再也不会被提走了！</p>
                    <p>试试在高亮位置放置黑棋，形成"两个眼"的局面。</p>
                `;
                
                // 放置一些黑棋，形成一个缺两个眼的形状
                placeStone(3, 3, 'black');
                placeStone(4, 3, 'black');
                placeStone(5, 3, 'black');
                placeStone(3, 4, 'black');
                placeStone(5, 4, 'black');
                placeStone(3, 5, 'black');
                placeStone(4, 5, 'black');
                placeStone(5, 5, 'black');
                
                // 放置一些白棋在周围
                placeStone(2, 3, 'white');
                placeStone(6, 3, 'white');
                placeStone(2, 4, 'white');
                placeStone(6, 4, 'white');
                placeStone(2, 5, 'white');
                placeStone(6, 5, 'white');
                
                // 设置"两个眼"任务
                currentTask = {
                    validPositions: [{x: 4, y: 4}],
                    placedStones: [],
                    requiredStones: 1
                };
                
                // 高亮显示可以放置棋子的位置
                highlightPosition(4, 4);
                
                // 自动选择黑棋
                selectStone('black');
                stoneSelection.style.display = 'none';
                break;
                
            case 7:
                // 第七课：综合练习
                lessonTitle.textContent = '第七步：综合练习';
                lessonContent.innerHTML = `
                    <p>现在让我们进行一场简单的对弈练习，巩固所学的规则。</p>
                    <p>你执黑先行，尝试围住更多的地盘并提走对方的棋子。</p>
                    <p>AI会根据你的落子做出回应。</p>
                `;
                
                // 设置综合练习任务
                currentTask = {
                    moveCount: 0,
                    requiredMoves: 10,
                    capturedStones: 0
                };
                
                // 自动选择黑棋
                selectStone('black');
                stoneSelection.style.display = 'flex';
                break;
                
            default:
                // 所有课程完成
                showLessonComplete();
                break;
        }
    };
    
    // 清空棋盘
    const clearBoard = () => {
        // 重置棋盘状态
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        
        // 移除所有棋子
        const stones = document.querySelectorAll('.stone');
        stones.forEach(stone => stone.remove());
    };
    
    // 选择棋子颜色
    const selectStone = (color) => {
        selectedStoneColor = color;
        
        // 更新UI
        const stoneOptions = document.querySelectorAll('.stone-option');
        stoneOptions.forEach(option => {
            if (option.dataset.color === color) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    };
    
    // 检查是否有棋子被提走（用于第7课）
    const checkCaptures = (x, y, color) => {
        const oppositeColor = color === 'black' ? 'white' : 'black';
        const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
        
        // 检查四个方向的相邻棋子
        directions.forEach(dir => {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            // 检查位置是否在棋盘内且有对方棋子
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === oppositeColor) {
                // 检查该棋子是否没有气了
                if (!hasLiberties(nx, ny)) {
                    // 找到该棋子所在的整个连通区域
                    const group = findConnectedGroup(nx, ny);
                    
                    // 如果整个组都没有气，则提走
                    if (!groupHasLiberties(group)) {
                        group.forEach(pos => {
                            removeStone(pos.x, pos.y);
                            if (currentTask) {
                                currentTask.capturedStones++;
                            }
                        });
                    }
                }
            }
        });
    };
    
    // 检查棋子是否有气
    const hasLiberties = (x, y) => {
        const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
        
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            // 检查位置是否在棋盘内且为空
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === null) {
                return true;
            }
        }
        
        return false;
    };
    
    // 找到与给定棋子相连的所有同色棋子
    const findConnectedGroup = (x, y) => {
        const color = board[y][x];
        const group = [];
        const visited = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
        
        const dfs = (cx, cy) => {
            if (cx < 0 || cx >= boardSize || cy < 0 || cy >= boardSize || visited[cy][cx] || board[cy][cx] !== color) {
                return;
            }
            
            visited[cy][cx] = true;
            group.push({x: cx, y: cy});
            
            dfs(cx, cy - 1); // 上
            dfs(cx + 1, cy); // 右
            dfs(cx, cy + 1); // 下
            dfs(cx - 1, cy); // 左
        };
        
        dfs(x, y);
        return group;
    };
    
    // 检查一组棋子是否有气
    const groupHasLiberties = (group) => {
        for (const pos of group) {
            const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
            
            for (const dir of directions) {
                const nx = pos.x + dir.dx;
                const ny = pos.y + dir.dy;
                
                // 检查位置是否在棋盘内且为空
                if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === null) {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    // 简单的AI落子逻辑（用于第7课）
    const getAIMove = () => {
        // 寻找一个合法的落子点
        const validMoves = [];
        
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                if (board[y][x] === null) {
                    // 检查是否是合法的落子点
                    if (isValidMove(x, y, 'white')) {
                        validMoves.push({x, y});
                    }
                }
            }
        }
        
        // 如果有合法的落子点，随机选择一个
        if (validMoves.length > 0) {
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        
        return null;
    };
    
    // 检查落子是否合法（用于AI）
    const isValidMove = (x, y, color) => {
        // 检查位置是否已有棋子
        if (board[y][x] !== null) {
            return false;
        }
        
        // 模拟落子
        board[y][x] = color;
        
        // 检查是否有气
        const hasLiberty = hasLiberties(x, y);
        
        // 检查是否可以提走对方的棋子
        const oppositeColor = color === 'black' ? 'white' : 'black';
        const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
        let canCapture = false;
        
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            // 检查位置是否在棋盘内且有对方棋子
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === oppositeColor) {
                // 检查该棋子是否没有气了
                if (!hasLiberties(nx, ny)) {
                    const group = findConnectedGroup(nx, ny);
                    if (!groupHasLiberties(group)) {
                        canCapture = true;
                        break;
                    }
                }
            }
        }
        
        // 撤销模拟落子
        board[y][x] = null;
        
        // 如果有气或者可以提走对方的棋子，则是合法的落子点
        return hasLiberty || canCapture;
    };
    
    // 计算领地（用于第7课）
    const countTerritory = (color) => {
        let count = 0;
        
        // 简单计算：检查每个空点，如果四周都是同色棋子，则算作该颜色的领地
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                if (board[y][x] === null) {
                    const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
                    let surroundedByColor = true;
                    
                    for (const dir of directions) {
                        const nx = x + dir.dx;
                        const ny = y + dir.dy;
                        
                        // 如果超出棋盘或者不是指定颜色的棋子，则不算作被包围
                        if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize || 
                            (board[ny][nx] !== color && board[ny][nx] !== null)) {
                            surroundedByColor = false;
                            break;
                        }
                    }
                    
                    if (surroundedByColor) {
                        count++;
                    }
                }
            }
        }
        
        return count;
    };
    
    // 显示课程完成页面
    const showLessonComplete = () => {
        document.querySelector('.game-container').style.display = 'none';
        lessonCompleteSection.style.display = 'block';
    };
    
    // 设置事件监听器
    const setupEventListeners = () => {
        // 重试按钮
        retryBtn.addEventListener('click', () => {
            setupLesson(currentLesson);
        });
        
        // 下一步按钮
        nextBtn.addEventListener('click', () => {
            if (currentLesson < totalLessons) {
                setupLesson(currentLesson + 1);
            } else {
                showLessonComplete();
            }
        });
        
        // 重新开始按钮
        restartBtn.addEventListener('click', () => {
            lessonCompleteSection.style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            setupLesson(1);
        });
        
        // 棋子选择
        const stoneOptions = document.querySelectorAll('.stone-option');
        stoneOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectStone(option.dataset.color);
            });
        });
    };
    
    // 初始化游戏
    initGame();
});