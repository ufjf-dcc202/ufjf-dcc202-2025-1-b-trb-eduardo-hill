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
  plantedSeeds: {},
}

// Configurações de crescimento das plantas (em minutos)
const PLANT_GROWTH_CONFIG = {
  seed1: {
    stageTime: 5 * 1000,
    stages: ['Seed.png', 'CarrotMidlle.png', 'CarrotFull.png'],
    name: 'Cenoura',
  },
  seed2: {
    stageTime: 8 * 1000,
    stages: ['Seed.png', 'MidlleSeed.png', 'CornFull.png'],
    name: 'Milho',
  },
  seed3: {
    stageTime: 10 * 1000,
    stages: ['Seed.png', 'MidlleSeed.png', 'TomatoFull.png'],
    name: 'Tomate',
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

        // Registra o tempo de plantio
        gameState.plantedSeeds[index] = {
          seedType: gameState.selectedSeed,
          plantedAt: Date.now(),
          currentStage: 0,
        }

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
      if (cellType.startsWith('planted-')) {
        const plantInfo = gameState.plantedSeeds[index]
        if (
          plantInfo &&
          plantInfo.currentStage ===
            PLANT_GROWTH_CONFIG[plantInfo.seedType].stages.length - 1
        ) {
          harvestPlant(index)
        } else {
          showMessage('Planta ainda não está madura para colheita!')
        }
      } else {
        showMessage('Selecione uma ferramenta ou semente!')
      }
    } else if (cellType.startsWith('planted-')) {
      const plantInfo = gameState.plantedSeeds[index]
      if (
        plantInfo &&
        plantInfo.currentStage ===
          PLANT_GROWTH_CONFIG[plantInfo.seedType].stages.length - 1
      ) {
        showMessage(
          'Planta madura! Clique sem ferramenta selecionada para colher.'
        )
      } else {
        showMessage('Já há uma planta aqui!')
      }
    }
  }

  updateUI()
}

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

    const plantInfo = gameState.plantedSeeds[index]
    if (plantInfo) {
      const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]
      const stageImage = config.stages[plantInfo.currentStage]
      img.src = `assets/images/${stageImage}`
    } else {
      img.src = 'assets/images/Seed.png'
    }

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

// Sistema de crescimento das plantas
function checkPlantGrowth() {
  const currentTime = Date.now()
  let plantsUpdated = false

  // Verifica cada planta no jogo
  Object.keys(gameState.plantedSeeds).forEach((index) => {
    const plantInfo = gameState.plantedSeeds[index]
    const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]

    // Calcula quanto tempo passou desde o plantio
    const timePassed = currentTime - plantInfo.plantedAt

    // Calcula qual estágio a planta deveria estar
    const expectedStage = Math.min(
      Math.floor(timePassed / config.stageTime),
      config.stages.length - 1
    )

    if (expectedStage > plantInfo.currentStage) {
      plantInfo.currentStage = expectedStage
      updateCellVisual(parseInt(index))
      plantsUpdated = true

      if (expectedStage === config.stages.length - 1) {
        showMessage(`${config.name} está pronta para colheita!`)
      }
    }
  })

  return plantsUpdated
}

// Função que roda a cada segundo para verificar crescimento
function startPlantGrowthTimer() {
  setInterval(() => {
    checkPlantGrowth()
  }, 1000)
}

// Função para colher plantas maduras
function harvestPlant(index) {
  const plantInfo = gameState.plantedSeeds[index]
  if (!plantInfo) return

  const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]

  // Valores de venda baseados no tipo de semente
  const sellPrices = {
    seed1: 35,
    seed2: 50,
    seed3: 70,
  }

  const sellPrice = sellPrices[plantInfo.seedType]

  gameState.currentMoney += sellPrice

  // Remove a planta e volta para terra sem arar (empty)
  gameState.grid[index] = 'empty'
  delete gameState.plantedSeeds[index]

  updateCellVisual(index)
  updateUI()

  showMessage(`${config.name} colhida! +$${sellPrice}`)
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
  startPlantGrowthTimer() // Inicia o sistema de crescimento

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
    buySeed('seed1', 20, 'Cenoura')
  })

  buySeed2Btn.addEventListener('click', () => {
    buySeed('seed2', 30, 'Milho')
  })

  buySeed3Btn.addEventListener('click', () => {
    buySeed('seed3', 40, 'Tomate')
  })

  // Event listener para avanço de dia
  const advanceDayBtn = document.getElementById('advance-day')
  advanceDayBtn.addEventListener('click', () => {
    advanceDay()
  })
})
