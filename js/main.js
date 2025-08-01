//Gerando Grid inicial plantas e pedras

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

//Estado inicial do jogo

const gameState = {
  currentDay: 1,
  currentMoney: 100,
  currentEnergy: 50,
  grid: generateInitialGrid(),
  selectedTool: null,
  selectedSeed: null,
  inventory: {
    seed1: 1,
    seed2: 0,
    seed3: 0,
  },
}

//Função para criar o grid 12x12
function createGrid() {
  const container = document.getElementById('game-grid')
  container.innerHTML = ''

  for (let i = 0; i < 144; i++) {
    const cell = document.createElement('div')
    cell.className = `cell ${gameState.grid[i]}`
    cell.dataset.index = i

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

//Função para mudança de estado de cada cell, retirada de pedra, planta, preparo do solo, etc
function handleCellClick(index) {
  const cellType = gameState.grid[index]

  if (gameState.currentEnergy <= 0) {
    showMessage('Sem energia! Avance o dia para recuperar.')
    return
  }

  if (gameState.selectedTool === 'pickax') {
    if (cellType === 'rock') {
      if (gameState.currentEnergy >= 20) {
        gameState.currentEnergy -= 20
        gameState.grid[index] = 'empty'
        updateCellVisual(index)
        showMessage('Pedra removida!')
      } else {
        showMessage('Energia insuficiente! Precisa de 20 energia.')
      }
    } else {
      showMessage('Use a picareta apenas em pedras!')
    }
  } else if (gameState.selectedTool === 'garden-scissors') {
    if (cellType === 'weed') {
      if (gameState.currentEnergy >= 10) {
        gameState.currentEnergy -= 10
        gameState.grid[index] = 'empty'
        updateCellVisual(index)
        showMessage('Erva daninha removida!')
      } else {
        showMessage('Energia insuficiente! Precisa de 10 energia.')
      }
    } else {
      showMessage('Use a tesoura apenas em ervas daninhas!')
    }
  } else if (gameState.selectedTool === 'hoe') {
    if (cellType === 'empty') {
      if (gameState.currentEnergy >= 5) {
        gameState.currentEnergy -= 5
        gameState.grid[index] = 'tilled'
        updateCellVisual(index)
        showMessage('Solo preparado para plantio!')
      } else {
        showMessage('Energia insuficiente! Precisa de 5 energia.')
      }
    } else if (cellType === 'rock') {
      showMessage('Remova a pedra primeiro com a picareta!')
    } else if (cellType === 'weed') {
      showMessage('Remova a erva daninha primeiro com a tesoura!')
    } else if (cellType === 'tilled') {
      showMessage('Solo já está preparado!')
    } else if (cellType.startsWith('planted-')) {
      showMessage('Já há uma planta aqui!')
    }
  } else if (gameState.selectedTool === 'watering-can') {
    if (cellType === 'empty' || cellType === 'tilled') {
      showMessage('Nada para regar aqui!')
    } else if (cellType.startsWith('planted-')) {
      showMessage('Planta regada! (sistema de rega em desenvolvimento)')
    } else {
      showMessage('Não é possível regar aqui!')
    }
  } else {
    if (gameState.selectedSeed && cellType === 'tilled') {
      if (gameState.inventory[gameState.selectedSeed] > 0) {
        gameState.inventory[gameState.selectedSeed]--
        gameState.grid[index] = `planted-${gameState.selectedSeed}`
        updateCellVisual(index)
        showMessage('Semente plantada!')

        if (gameState.inventory[gameState.selectedSeed] === 0) {
          gameState.selectedSeed = null
          updateSeedVisuals()
          showMessage('Sementes esgotadas! Compre mais na loja.')
        }
      } else {
        showMessage('Você não tem essa semente!')
      }
    } else if (gameState.selectedSeed && cellType !== 'tilled') {
      showMessage('Prepare o solo com a enxada primeiro!')
    } else if (!gameState.selectedSeed && !gameState.selectedTool) {
      showMessage('Selecione uma ferramenta ou semente!')
    } else if (cellType.startsWith('planted-')) {
      showMessage('Já há uma planta aqui!')
    }
  }

  updateUI()
} //Funçao para mudar o vizual de cada cell de acordo com seu estado

function updateCellVisual(index) {
  const cell = document.querySelector(`[data-index="${index}"]`)
  const cellType = gameState.grid[index]

  cell.className = `cell ${cellType}`

  const existingImg = cell.querySelector('img')
  if (existingImg) {
    existingImg.remove()
  }

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
  } else if (cellType.startsWith('planted-')) {
    const img = document.createElement('img')
    img.src = 'assets/images/Seed.png'
    img.alt = 'Planted Seed'
    img.className = 'cell-image'
    cell.appendChild(img)
  }
}

function showMessage(text) {
  const messageDisplay = document.getElementById('message-display')
  messageDisplay.textContent = text

  setTimeout(() => {
    messageDisplay.textContent = ''
  }, 3000)
}

function selectSeed(seedType) {
  if (gameState.selectedSeed === seedType) {
    gameState.selectedSeed = null
    showMessage('Semente desselecionada')
  } else {
    gameState.selectedSeed = seedType
    const seedNames = { seed1: 'Cenoura', seed2: 'Milho', seed3: 'Tomate' }
    showMessage(`${seedNames[seedType]} selecionada`)
  }
  updateSeedVisuals()
}

function updateSeedVisuals() {
  document.querySelectorAll('[data-seed]').forEach((seed) => {
    seed.classList.remove('selected')
  })

  if (gameState.selectedSeed) {
    const selectedSeed = document.querySelector(
      `[data-seed="${gameState.selectedSeed}"]`
    )
    if (selectedSeed) {
      selectedSeed.classList.add('selected')
    }
  }
}

function selectTool(toolType) {
  if (gameState.selectedTool === toolType) {
    gameState.selectedTool = null
    showMessage('Ferramenta desselecionada')
  } else {
    gameState.selectedTool = toolType
    const toolNames = {
      hoe: 'Enxada',
      pickax: 'Picareta',
      'garden-scissors': 'Tesoura',
      'watering-can': 'Regador',
    }
    showMessage(`${toolNames[toolType]} selecionada`)
  }
  updateToolVisuals()
}

function updateToolVisuals() {
  document.querySelectorAll('[data-tool]').forEach((tool) => {
    tool.classList.remove('selected')
  })

  if (gameState.selectedTool) {
    const selectedTool = document.querySelector(
      `[data-tool="${gameState.selectedTool}"]`
    )
    if (selectedTool) {
      selectedTool.classList.add('selected')
    }
  }
}

//Funçao para dar update no hud do jogador. Dinheiro, energia e dias
function updateUI() {
  const energyDisplay = document.querySelector('#energy-display span')
  if (energyDisplay) {
    energyDisplay.textContent = gameState.currentEnergy
  }

  const moneyDisplay = document.querySelector('#current-money')
  if (moneyDisplay) {
    moneyDisplay.textContent = gameState.currentMoney
  }

  const dayDisplay = document.querySelector('#current-day')
  if (dayDisplay) {
    dayDisplay.textContent = gameState.currentDay
  }

  document.getElementById('count-seed1').textContent = gameState.inventory.seed1
  document.getElementById('count-seed2').textContent = gameState.inventory.seed2
  document.getElementById('count-seed3').textContent = gameState.inventory.seed3
}

//Função para comprar sementes na loja
function buySeed(seedType, cost, seedName) {
  if (gameState.currentMoney >= cost) {
    gameState.currentMoney -= cost
    gameState.inventory[seedType]++
    updateUI()
    showMessage(`${seedName} comprada por $${cost}!`)
  } else {
    showMessage(`Dinheiro insuficiente! Precisa de $${cost}.`)
  }
}

//Função para avançar um dia
function advanceDay() {
  gameState.currentDay++
  gameState.currentEnergy = 50
  
  updateUI()
  showMessage(`Dia ${gameState.currentDay} começou! Energia recuperada.`)
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
  updateUI()

  document.querySelectorAll('[data-tool]').forEach((toolSlot) => {
    toolSlot.addEventListener('click', function () {
      const toolType = this.dataset.tool
      selectTool(toolType)
    })
  })

  document.querySelectorAll('[data-seed]').forEach((seedSlot) => {
    seedSlot.addEventListener('click', function () {
      const seedType = this.dataset.seed
      if (gameState.inventory[seedType] > 0) {
        selectSeed(seedType)
      } else {
        showMessage('Você não tem essa semente! Compre na loja.')
      }
    })
  })

  // Event listeners para compra de sementes
  const buySeed1Btn = document.querySelector('.buy-seed1-button')
  const buySeed2Btn = document.querySelector('.buy-seed2-button')
  const buySeed3Btn = document.querySelector('.buy-seed3-button')

  // Adicionando eventos de clique para os botões de compra de sementes
  buySeed1Btn.addEventListener('click', () => {
    buySeed('seed1', 10, 'Cenoura')
  })

  buySeed2Btn.addEventListener('click', () => {
    buySeed('seed2', 15, 'Milho')
  })

  buySeed3Btn.addEventListener('click', () => {
    buySeed('seed3', 20, 'Tomate')
  })

  // Event listener para avanço de dia
  const advanceDayBtn = document.getElementById('advance-day')
  advanceDayBtn.addEventListener('click', () => {
    advanceDay()
  })
})
