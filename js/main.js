/* Função para gerar o grid inicial */
function generateInitialGrid() {
  const grid = new Array(144)

  for (let i = 0; i < 144; i++) {
    const random = Math.random()
    if (random < 0.1) {
      grid[i] = 'weed'
    } else {
      grid[i] = 'rock'
    }
  }
  return grid
}

/* Estado inicial do jogo */
const gameState = {
  currentDay: 1,
  currentMoney: 0,
  currentEnergy: 50,
  grid: generateInitialGrid(),
  selectedSeed: null,
  inventory: {
    seed1: 1,
    seed2: 0,
    seed3: 0,
  },
}

/* Função para criar o grid */
function createGrid() {
  const container = document.getElementById('game-grid')
  container.innerHTML = ''

  for (let i = 0; i < 144; i++) {
    const cell = document.createElement('div')
    cell.className = `cell ${gameState.grid[i]}`
    cell.dataset.index = i

    cell.addEventListener('click', function () {
      handleCellClick(i)
    })

    container.appendChild(cell)
  }
}

function handleCellClick(index) {
  const cellType = gameState.grid[index]

  if (cellType === 'rock') {
    gameState.currentEnergy = gameState.currentEnergy - 20
    gameState.grid[index] = 'empty'
    updateCellVisual(index)
  } else if (cellType === 'weed') {
    gameState.currentEnergy = gameState.currentEnergy - 10
    gameState.grid[index] = 'empty'
    updateCellVisual(index)
  }

  console.log(gameState.currentEnergy)
}

function updateCellVisual(index) {
  const cell = document.querySelector(`[data-index="${index}"]`)
  const cellType = gameState.grid[index]

  cell.className = `cell ${cellType}`
}

const seedShopBtn = document.getElementById('seed-shop-button')
seedShopBtn.addEventListener('click', () => {
  const modal = document.getElementById('shop-modal')
  modal.style.display = 'block'
})

const seedShopCloseBtn = document.getElementById('close-shop-modal')
seedShopCloseBtn.addEventListener('click', () => {
  const modal = document.getElementById('shop-modal')
  modal.style.display = 'none'
})

document.addEventListener('DOMContentLoaded', function () {
  createGrid()
})
