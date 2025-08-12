// ==========================================
// SISTEMA DE GRID E CÉLULAS
// ==========================================

// Cria e configura uma imagem para a célula baseada no tipo
function createCellImage(cellType, index) {
  const img = document.createElement('img')
  img.className = 'cell-image'

  if (cellType === 'weed') {
    img.src = './assets/images/Weed.png'
    img.alt = 'Weed'
  } else if (cellType === 'rock') {
    img.src = './assets/images/Roock.png'
    img.alt = 'Rock'
  } else if (
    cellType === 'dead-plant' ||
    (cellType.startsWith('planted-') && gameState.plantedSeeds[index]?.isDead)
  ) {
    // Plantas mortas (tanto o tipo 'dead-plant' quanto plantas com flag isDead)
    img.src = './assets/images/dead-plant.png'
    img.alt = 'Dead Plant'
  } else if (cellType.startsWith('planted-')) {
    const plantInfo = gameState.plantedSeeds[index]
    if (plantInfo) {
      const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]
      const stageImage = config.stages[plantInfo.currentStage]
      img.src = `./assets/images/${stageImage}`
      img.alt = 'Planted Seed'
    } else {
      img.src = './assets/images/Seed.png'
      img.alt = 'Planted Seed'
    }
  }

  return img
}

// Cria o grid visual 12x12 no DOM
function createGrid() {
  const container = document.getElementById('game-grid')
  container.innerHTML = ''

  for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
    const cell = document.createElement('div')
    cell.className = `cell ${gameState.grid[i]}`
    cell.dataset.index = i

    // Adiciona imagem se necessário
    const cellType = gameState.grid[i]
    if (cellType !== 'empty' && cellType !== 'tilled') {
      const img = createCellImage(cellType, i)
      cell.appendChild(img)
    }

    cell.addEventListener('click', function () {
      handleCellClick(i)
    })

    container.appendChild(cell)
  }
}

// Atualiza o visual de uma célula específica do grid
function updateCellVisual(index) {
  const cell = document.querySelector(`[data-index="${index}"]`)
  const cellType = gameState.grid[index]

  cell.className = `cell ${cellType}`

  // Remove imagem existente
  const existingImg = cell.querySelector('img')
  if (existingImg) {
    existingImg.remove()
  }

  // Adiciona nova imagem se necessário
  if (cellType !== 'empty' && cellType !== 'tilled') {
    const img = createCellImage(cellType, index)
    cell.appendChild(img)
  }
}
