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

    // Adicionar imagem baseada no tipo da célula
    if (gameState.grid[i] === 'weed') {
      const img = document.createElement('img')
      img.src = 'assets/images/Weed.png'
      img.alt = 'Weed'
      img.className = 'cell-image'
      cell.appendChild(img)
    } else if (gameState.grid[i] === 'rock') {
      const img = document.createElement('img')
      img.src = 'assets/images/Roock.png'
      img.alt = 'Rock'
      img.className = 'cell-image'
      cell.appendChild(img)
    }

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

  // Remover imagem existente
  const existingImg = cell.querySelector('img')
  if (existingImg) {
    existingImg.remove()
  }

  // Adicionar nova imagem se necessário
  if (cellType === 'weed') {
    const img = document.createElement('img')
    img.src = 'assets/images/Weed.png'
    img.alt = 'Weed'
    img.className = 'cell-image'
    cell.appendChild(img)
  } else if (cellType === 'rock') {
    const img = document.createElement('img')
    img.src = 'assets/images/Roock.png'
    img.alt = 'Rock'
    img.className = 'cell-image'
    cell.appendChild(img)
  }
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
