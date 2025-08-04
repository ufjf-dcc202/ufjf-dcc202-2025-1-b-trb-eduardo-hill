// Gera grid inicial com pedras e ervas daninhas
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

// Estado global do jogo
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

// Configurações de crescimento das plantas
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

// Cria o grid visual 12x12 no DOM
function createGrid() {
  const container = document.getElementById('game-grid')
  container.innerHTML = ''

  for (let i = 0; i < 144; i++) {
    const cell = document.createElement('div')
    cell.className = `cell ${gameState.grid[i]}`
    cell.dataset.index = i

    if (gameState.grid[i] === 'weed') {
      const img = document.createElement('img')
      img.src = './assets/images/Weed.png'
      img.alt = 'Weed'
      img.className = 'cell-image'
      cell.appendChild(img)
    } else if (gameState.grid[i] === 'rock') {
      const img = document.createElement('img')
      img.src = './assets/images/Roock.png'
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

// Gerencia cliques nas células do grid - ferramentas, plantio e colheita
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
    } else if (cellType === 'dead-plant') {
      if (gameState.currentEnergy >= 8) {
        gameState.currentEnergy -= 8
        gameState.grid[index] = 'tilled'
        delete gameState.plantedSeeds[index] // Remove dados da planta morta
        updateCellVisual(index)
        showMessage('Planta morta removida e solo preparado!')
      } else {
        showMessage('Energia insuficiente! Precisa de 8 energia.')
      }
    } else if (cellType === 'rock') {
      showMessage('Remova a pedra primeiro com a picareta!')
    } else if (cellType === 'weed') {
      showMessage('Remova a erva daninha primeiro com a tesoura!')
    } else if (cellType === 'tilled') {
      showMessage('Solo já está preparado!')
    } else if (cellType.startsWith('planted-')) {
      const plantInfo = gameState.plantedSeeds[index]
      if (plantInfo && plantInfo.isDead) {
        if (gameState.currentEnergy >= 8) {
          gameState.currentEnergy -= 8
          gameState.grid[index] = 'tilled'
          delete gameState.plantedSeeds[index]
          updateCellVisual(index)
          showMessage('Planta morta removida e solo preparado!')
        } else {
          showMessage('Energia insuficiente! Precisa de 8 energia.')
        }
      } else {
        showMessage('Já há uma planta aqui!')
      }
    }
  } else if (gameState.selectedTool === 'watering-can') {
    if (cellType === 'empty' || cellType === 'tilled') {
      showMessage('Nada para regar aqui!')
    } else if (cellType.startsWith('planted-')) {
      const plantInfo = gameState.plantedSeeds[index]
      if (plantInfo && !plantInfo.isDead) {
        if (!plantInfo.watered) {
          if (gameState.currentEnergy >= 3) {
            gameState.currentEnergy -= 3
            plantInfo.watered = true
            showMessage('Planta regada!')
          } else {
            showMessage('Energia insuficiente! Precisa de 3 energia.')
          }
        } else {
          showMessage('Planta já foi regada neste estágio!')
        }
      } else if (plantInfo && plantInfo.isDead) {
        showMessage('Planta morta! Use a enxada para remover.')
      } else {
        showMessage('Não é possível regar aqui!')
      }
    } else if (cellType === 'dead-plant') {
      showMessage('Planta morta! Use a enxada para remover.')
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
          watered: false,
          isDead: false,
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
        if (plantInfo && plantInfo.isDead) {
          showMessage('Planta morta! Use a enxada para remover.')
        } else if (
          plantInfo &&
          plantInfo.currentStage ===
            PLANT_GROWTH_CONFIG[plantInfo.seedType].stages.length - 1
        ) {
          harvestPlant(index)
        } else {
          showMessage('Planta ainda não está madura para colheita!')
        }
      } else if (cellType === 'dead-plant') {
        showMessage('Planta morta! Use a enxada para remover.')
      } else {
        showMessage('Selecione uma ferramenta ou semente!')
      }
    } else if (cellType.startsWith('planted-') || cellType === 'dead-plant') {
      if (cellType === 'dead-plant') {
        showMessage('Planta morta! Use a enxada para remover.')
      } else {
        const plantInfo = gameState.plantedSeeds[index]
        if (plantInfo && plantInfo.isDead) {
          showMessage('Planta morta! Use a enxada para remover.')
        } else if (
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
  }

  updateUI()
}

// Atualiza o visual de uma célula específica do grid
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
    img.src = './assets/images/Weed.png'
    img.alt = 'Weed'
    img.className = 'cell-image'
    cell.appendChild(img)
  } else if (cellType === 'rock') {
    const img = document.createElement('img')
    img.src = './assets/images/Roock.png'
    img.alt = 'Rock'
    img.className = 'cell-image'
    cell.appendChild(img)
  } else if (cellType.startsWith('planted-') || cellType === 'dead-plant') {
    const img = document.createElement('img')

    if (cellType === 'dead-plant') {
      img.src = './assets/images/dead-plant.png'
      img.alt = 'Dead Plant'
    } else {
      const plantInfo = gameState.plantedSeeds[index]
      if (plantInfo) {
        if (plantInfo.isDead) {
          img.src = './assets/images/dead-plant.png'
          img.alt = 'Dead Plant'
        } else {
          const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]
          const stageImage = config.stages[plantInfo.currentStage]
          img.src = `./assets/images/${stageImage}`
          img.alt = 'Planted Seed'
        }
      } else {
        img.src = './assets/images/Seed.png'
        img.alt = 'Planted Seed'
      }
    }

    img.className = 'cell-image'
    cell.appendChild(img)
  }
}

// Exibe mensagens temporárias para o jogador
function showMessage(text) {
  const messageDisplay = document.getElementById('message-display')
  messageDisplay.textContent = text

  setTimeout(() => {
    messageDisplay.textContent = ''
  }, 3000)
}

// Verifica e processa o crescimento das plantas baseado na rega
function checkPlantGrowth() {
  const currentTime = Date.now()
  let plantsUpdated = false

  Object.keys(gameState.plantedSeeds).forEach((index) => {
    const plantInfo = gameState.plantedSeeds[index]

    if (plantInfo.isDead) return

    const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]
    const timePassed = currentTime - plantInfo.plantedAt
    const expectedStage = Math.min(
      Math.floor(timePassed / config.stageTime),
      config.stages.length - 1
    )

    if (expectedStage > plantInfo.currentStage) {
      if (plantInfo.watered) {
        plantInfo.currentStage = expectedStage
        plantInfo.watered = false
        updateCellVisual(parseInt(index))
        plantsUpdated = true

        if (expectedStage === config.stages.length - 1) {
          showMessage(`${config.name} está pronta para colheita!`)
        } else {
          showMessage(`${config.name} cresceu! Regue para continuar crescendo.`)
        }
      }
    }
  })

  return plantsUpdated
}

// Inicia o timer de crescimento das plantas
function startPlantGrowthTimer() {
  setInterval(() => {
    checkPlantGrowth()
  }, 1000)
}

// Processa a colheita de plantas maduras
function harvestPlant(index) {
  const plantInfo = gameState.plantedSeeds[index]
  if (!plantInfo) return

  const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]

  const sellPrices = {
    seed1: 35,
    seed2: 50,
    seed3: 70,
  }

  const sellPrice = sellPrices[plantInfo.seedType]

  gameState.currentMoney += sellPrice

  gameState.grid[index] = 'empty'
  delete gameState.plantedSeeds[index]

  updateCellVisual(index)
  updateUI()

  showMessage(`${config.name} colhida! +$${sellPrice}`)
}

// Gerencia seleção e desseleção de sementes
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

// Atualiza visual de seleção das sementes
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

// Gerencia seleção e desseleção de ferramentas
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

// Atualiza visual de seleção das ferramentas
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

// Atualiza informações do HUD (dinheiro, energia, dia, inventário)
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

// Processa compra de sementes na loja
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

// Avança um dia, recupera energia e mata plantas não regadas
function advanceDay() {
  gameState.currentDay++
  gameState.currentEnergy = 50

  killUnwateredPlants()

  updateUI()
  showMessage(`Dia ${gameState.currentDay} começou! Energia recuperada.`)
}

// Mata plantas que não foram regadas quando o dia avança
function killUnwateredPlants() {
  let plantsKilled = 0

  Object.keys(gameState.plantedSeeds).forEach((index) => {
    const plantInfo = gameState.plantedSeeds[index]

    if (!plantInfo.watered && !plantInfo.isDead && plantInfo.currentStage > 0) {
      plantInfo.isDead = true
      gameState.grid[index] = 'dead-plant'
      updateCellVisual(parseInt(index))
      plantsKilled++
    }
  })

  if (plantsKilled > 0) {
    showMessage(`${plantsKilled} planta(s) morreram por falta de água!`)
  }
}

// Event listeners para modais da loja
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

// Inicialização do jogo e event listeners
document.addEventListener('DOMContentLoaded', function () {
  createGrid()
  updateUI()
  startPlantGrowthTimer()

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

  const buySeed1Btn = document.querySelector('.buy-seed1-button')
  const buySeed2Btn = document.querySelector('.buy-seed2-button')
  const buySeed3Btn = document.querySelector('.buy-seed3-button')

  buySeed1Btn.addEventListener('click', () => {
    buySeed('seed1', 20, 'Cenoura')
  })

  buySeed2Btn.addEventListener('click', () => {
    buySeed('seed2', 30, 'Milho')
  })

  buySeed3Btn.addEventListener('click', () => {
    buySeed('seed3', 40, 'Tomate')
  })

  const advanceDayBtn = document.getElementById('advance-day')
  advanceDayBtn.addEventListener('click', () => {
    advanceDay()
  })
})
