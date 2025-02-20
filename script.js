const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
let score = 0;
let grid = [];
const GRID_SIZE = 4;

// Initialize the game grid
const initGrid = () => {
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.setAttribute('data-row', i);
            tile.setAttribute('data-col', j);
            gridContainer.appendChild(tile);
        }
    }
};

// Update the visual representation of the grid
const updateGrid = () => {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const row = parseInt(tile.getAttribute('data-row'));
        const col = parseInt(tile.getAttribute('data-col'));
        const value = grid[row][col];
        tile.textContent = value || '';
        tile.setAttribute('data-value', value || '');
    });
    scoreDisplay.textContent = score;
};

// Generate a new tile (2 or 4) at a random empty position
const generateNewTile = () => {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
};

// Move tiles in a specific direction
const moveTiles = (direction) => {
    let moved = false;
    const mergedTiles = new Set();

    const moveCell = (fromRow, fromCol, toRow, toCol) => {
        if (grid[fromRow][fromCol] === 0) return false;
        if (grid[toRow][toCol] === 0) {
            grid[toRow][toCol] = grid[fromRow][fromCol];
            grid[fromRow][fromCol] = 0;
            return true;
        }
        if (grid[toRow][toCol] === grid[fromRow][fromCol] && 
            !mergedTiles.has(`${toRow},${toCol}`)) {
            grid[toRow][toCol] *= 2;
            grid[fromRow][fromCol] = 0;
            score += grid[toRow][toCol];
            mergedTiles.add(`${toRow},${toCol}`);
            return true;
        }
        return false;
    };

    switch (direction) {
        case 'ArrowUp':
            for (let col = 0; col < GRID_SIZE; col++) {
                for (let row = 1; row < GRID_SIZE; row++) {
                    for (let currentRow = row; currentRow > 0; currentRow--) {
                        if (moveCell(currentRow, col, currentRow - 1, col)) {
                            moved = true;
                        }
                    }
                }
            }
            break;
        case 'ArrowDown':
            for (let col = 0; col < GRID_SIZE; col++) {
                for (let row = GRID_SIZE - 2; row >= 0; row--) {
                    for (let currentRow = row; currentRow < GRID_SIZE - 1; currentRow++) {
                        if (moveCell(currentRow, col, currentRow + 1, col)) {
                            moved = true;
                        }
                    }
                }
            }
            break;
        case 'ArrowLeft':
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 1; col < GRID_SIZE; col++) {
                    for (let currentCol = col; currentCol > 0; currentCol--) {
                        if (moveCell(row, currentCol, row, currentCol - 1)) {
                            moved = true;
                        }
                    }
                }
            }
            break;
        case 'ArrowRight':
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = GRID_SIZE - 2; col >= 0; col--) {
                    for (let currentCol = col; currentCol < GRID_SIZE - 1; currentCol++) {
                        if (moveCell(row, currentCol, row, currentCol + 1)) {
                            moved = true;
                        }
                    }
                }
            }
            break;
    }
    return moved;
};

// Check if game is over
const isGameOver = () => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    
    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const current = grid[i][j];
            if ((i < GRID_SIZE - 1 && grid[i + 1][j] === current) ||
                (j < GRID_SIZE - 1 && grid[i][j + 1] === current)) {
                return false;
            }
        }
    }
    return true;
};

// Handle keyboard events
const handleKeyPress = (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        const moved = moveTiles(event.key);
        if (moved) {
            generateNewTile();
            updateGrid();
            if (isGameOver()) {
                alert('Game Over! Final Score: ' + score);
            }
        }
    }
};

// Start a new game
const startGame = () => {
    score = 0;
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    gridContainer.innerHTML = '';
    initGrid();
    generateNewTile();
    generateNewTile();
    updateGrid();
};

// Event listeners
document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', startGame);

// Initialize the game
startGame();
