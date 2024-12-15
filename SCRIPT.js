const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playPauseButton = document.getElementById('playPauseButton');
const resetButton = document.getElementById('resetButton');
const speedControl = document.getElementById('speedControl');

canvas.width = 600;
canvas.height = 600;

const CELL_SIZE = 10;
const ROWS = canvas.height / CELL_SIZE;
const COLS = canvas.width / CELL_SIZE;

let grid = createGrid();
let running = false;
let interval = null;

// Create a grid with dead cells
function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = grid[row][col] ? '#333' : '#fff';
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Update the grid based on Conway's rules
function updateGrid() {
  const newGrid = createGrid();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const neighbors = countNeighbors(row, col);
      if (grid[row][col]) {
        newGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        newGrid[row][col] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  grid = newGrid;
}

// Count the number of alive neighbors
function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const r = (row + i + ROWS) % ROWS;
      const c = (col + j + COLS) % COLS;
      count += grid[r][c];
    }
  }
  return count;
}

// Start or pause the simulation
playPauseButton.addEventListener('click', () => {
  running = !running;
  playPauseButton.textContent = running ? 'Pause' : 'Play';
  if (running) {
    interval = setInterval(() => {
      updateGrid();
      drawGrid();
    }, parseInt(speedControl.value));
  } else {
    clearInterval(interval);
  }
});

// Reset the simulation
resetButton.addEventListener('click', () => {
  clearInterval(interval);
  running = false;
  playPauseButton.textContent = 'Play';
  grid = createGrid();
  drawGrid();
});

// Handle speed control changes
speedControl.addEventListener('change', () => {
  if (running) {
    clearInterval(interval);
    interval = setInterval(() => {
      updateGrid();
      drawGrid();
    }, parseInt(speedControl.value));
  }
});

// Handle canvas clicks to toggle cell states
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  grid[row][col] = grid[row][col] ? 0 : 1;
  drawGrid();
});

// Initialize the grid
drawGrid();