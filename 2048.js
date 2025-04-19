document.addEventListener('DOMContentLoaded', () => {
  const game2048 = () => {
    // Game state
    let board = [];
    let score = 0;
    let bestScore = localStorage.getItem('2048-best-score') || 0;
    let gameOver = false;
    let won = false;
    let touchStartX = 0;
    let touchStartY = 0;

    // DOM elements
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game-button');

    // Initialize the game
    const initGame = () => {
      // Initialize empty board
      board = Array(4).fill().map(() => Array(4).fill(0));
      score = 0;
      gameOver = false;
      won = false;

      // Update UI
      updateScore();
      updateBestScore();

      // Add two initial tiles
      addRandomTile();
      addRandomTile();
      updateBoard();

      // Add event listeners
      setupEventListeners();
    };

    // Update the score display
    const updateScore = () => {
      scoreElement.textContent = score;
    };

    // Update best score display and save to local storage
    const updateBestScore = () => {
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('2048-best-score', bestScore);
      }
      bestScoreElement.textContent = bestScore;
    };

    // Update the board UI
    const updateBoard = () => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const cell = document.getElementById(`cell-${i}-${j}`);
          const value = board[i][j];
          
          // Clear previous content and classes
          cell.innerHTML = '';
          cell.className = 'grid-cell';
          
          if (value !== 0) {
            // Create tile element
            const tile = document.createElement('div');
            tile.textContent = value;
            tile.className = `tile tile-${value}`;
            
            // Add animation class for new tiles
            if (cell.getAttribute('data-new') === 'true') {
              tile.classList.add('tile-new');
              cell.removeAttribute('data-new');
            }
            
            // Add merged class for merged tiles
            if (cell.getAttribute('data-merged') === 'true') {
              tile.classList.add('tile-merged');
              cell.removeAttribute('data-merged');
            }
            
            cell.appendChild(tile);
          }
        }
      }
    };

    // Add a random tile (2 or 4) to an empty cell
    const addRandomTile = () => {
      const emptyCells = [];
      
      // Find all empty cells
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === 0) {
            emptyCells.push({ i, j });
          }
        }
      }
      
      // If there are empty cells available
      if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // 10% chance of getting a 4, 90% chance of getting a 2
        board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
        
        // Mark the cell as new for animation
        document.getElementById(`cell-${randomCell.i}-${randomCell.j}`).setAttribute('data-new', 'true');
        
        return true;
      }
      return false;
    };

    // Move tiles in a given direction and handle merges
    const moveTiles = (direction) => {
      if (gameOver) return false;
      
      let moved = false;
      let mergedCells = [];
      
      // Make a deep copy of the board to check if it changed
      const oldBoard = JSON.parse(JSON.stringify(board));
      
      switch (direction) {
        case 'up':
          for (let j = 0; j < 4; j++) {
            for (let i = 1; i < 4; i++) {
              if (board[i][j] !== 0) {
                let row = i;
                while (row > 0 && (board[row - 1][j] === 0 || board[row - 1][j] === board[row][j])) {
                  if (board[row - 1][j] === 0) {
                    // Move to empty cell
                    board[row - 1][j] = board[row][j];
                    board[row][j] = 0;
                    row--;
                    moved = true;
                  } else if (board[row - 1][j] === board[row][j] && !mergedCells.some(cell => cell.i === row - 1 && cell.j === j)) {
                    // Merge with same value tile
                    board[row - 1][j] *= 2;
                    score += board[row - 1][j];
                    board[row][j] = 0;
                    mergedCells.push({ i: row - 1, j });
                    moved = true;
                    
                    // Mark the cell as merged for animation
                    document.getElementById(`cell-${row - 1}-${j}`).setAttribute('data-merged', 'true');
                    
                    // Check for win
                    if (board[row - 1][j] === 2048 && !won) {
                      win();
                    }
                    break;
                  } else {
                    break;
                  }
                }
              }
            }
          }
          break;
          
        case 'down':
          for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
              if (board[i][j] !== 0) {
                let row = i;
                while (row < 3 && (board[row + 1][j] === 0 || board[row + 1][j] === board[row][j])) {
                  if (board[row + 1][j] === 0) {
                    // Move to empty cell
                    board[row + 1][j] = board[row][j];
                    board[row][j] = 0;
                    row++;
                    moved = true;
                  } else if (board[row + 1][j] === board[row][j] && !mergedCells.some(cell => cell.i === row + 1 && cell.j === j)) {
                    // Merge with same value tile
                    board[row + 1][j] *= 2;
                    score += board[row + 1][j];
                    board[row][j] = 0;
                    mergedCells.push({ i: row + 1, j });
                    moved = true;
                    
                    // Mark the cell as merged for animation
                    document.getElementById(`cell-${row + 1}-${j}`).setAttribute('data-merged', 'true');
                    
                    // Check for win
                    if (board[row + 1][j] === 2048 && !won) {
                      win();
                    }
                    break;
                  } else {
                    break;
                  }
                }
              }
            }
          }
          break;
          
        case 'left':
          for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
              if (board[i][j] !== 0) {
                let col = j;
                while (col > 0 && (board[i][col - 1] === 0 || board[i][col - 1] === board[i][col])) {
                  if (board[i][col - 1] === 0) {
                    // Move to empty cell
                    board[i][col - 1] = board[i][col];
                    board[i][col] = 0;
                    col--;
                    moved = true;
                  } else if (board[i][col - 1] === board[i][col] && !mergedCells.some(cell => cell.i === i && cell.j === col - 1)) {
                    // Merge with same value tile
                    board[i][col - 1] *= 2;
                    score += board[i][col - 1];
                    board[i][col] = 0;
                    mergedCells.push({ i, j: col - 1 });
                    moved = true;
                    
                    // Mark the cell as merged for animation
                    document.getElementById(`cell-${i}-${col - 1}`).setAttribute('data-merged', 'true');
                    
                    // Check for win
                    if (board[i][col - 1] === 2048 && !won) {
                      win();
                    }
                    break;
                  } else {
                    break;
                  }
                }
              }
            }
          }
          break;
          
        case 'right':
          for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
              if (board[i][j] !== 0) {
                let col = j;
                while (col < 3 && (board[i][col + 1] === 0 || board[i][col + 1] === board[i][col])) {
                  if (board[i][col + 1] === 0) {
                    // Move to empty cell
                    board[i][col + 1] = board[i][col];
                    board[i][col] = 0;
                    col++;
                    moved = true;
                  } else if (board[i][col + 1] === board[i][col] && !mergedCells.some(cell => cell.i === i && cell.j === col + 1)) {
                    // Merge with same value tile
                    board[i][col + 1] *= 2;
                    score += board[i][col + 1];
                    board[i][col] = 0;
                    mergedCells.push({ i, j: col + 1 });
                    moved = true;
                    
                    // Mark the cell as merged for animation
                    document.getElementById(`cell-${i}-${col + 1}`).setAttribute('data-merged', 'true');
                    
                    // Check for win
                    if (board[i][col + 1] === 2048 && !won) {
                      win();
                    }
                    break;
                  } else {
                    break;
                  }
                }
              }
            }
          }
          break;
      }
      
      if (moved) {
        updateScore();
        updateBestScore();
        addRandomTile();
        updateBoard();
        
        // Check if game over after each move
        if (!canMove()) {
          gameOver = true;
          setTimeout(() => {
            alert('Game over! No more moves available.');
          }, 300);
        }
      }
      
      return moved;
    };

    // Check if any moves are possible
    const canMove = () => {
      // Check for empty cells
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === 0) {
            return true;
          }
        }
      }
      
      // Check for possible merges horizontally
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === board[i][j + 1]) {
            return true;
          }
        }
      }
      
      // Check for possible merges vertically
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === board[i + 1][j]) {
            return true;
          }
        }
      }
      
      return false;
    };

    // Handle winning the game
    const win = () => {
      won = true;
      setTimeout(() => {
        alert('Congratulations! You\'ve reached 2048!');
      }, 300);
    };

    // Set up event listeners for keyboard and touch controls
    const setupEventListeners = () => {
      // Keyboard event listeners
      document.addEventListener('keydown', (event) => {
        event.preventDefault();
        
        switch (event.key) {
          case 'ArrowUp':
            moveTiles('up');
            break;
          case 'ArrowDown':
            moveTiles('down');
            break;
          case 'ArrowLeft':
            moveTiles('left');
            break;
          case 'ArrowRight':
            moveTiles('right');
            break;
        }
      });
      
      // Touch event listeners for mobile
      const gridContainer = document.querySelector('.grid-container');
      
      gridContainer.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });
      
      gridContainer.addEventListener('touchend', (event) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Check if it's a significant swipe (more than 30px)
        if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
          // Determine if horizontal or vertical swipe based on which has greater change
          if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
              moveTiles('right');
            } else {
              moveTiles('left');
            }
          } else {
            // Vertical swipe
            if (diffY > 0) {
              moveTiles('down');
            } else {
              moveTiles('up');
            }
          }
        }
        
        // Reset touch start coordinates
        touchStartX = 0;
        touchStartY = 0;
      }, { passive: true });
      
      // New game button event listener
      newGameButton.addEventListener('click', initGame);
    };

    // Initialize the game
    initGame();
  };

  game2048();
});