// ==========================================
// SISTEMA DE PLANTAS E CRESCIMENTO
// ==========================================

// Exibe mensagens temporárias para o jogador
function showMessage(text) {
  const messageDisplay = document.getElementById('message-display')
  messageDisplay.textContent = text

  setTimeout(() => {
    messageDisplay.textContent = ''
  }, GAME_CONFIG.MESSAGE_DURATION)
}

// Verifica e processa o crescimento das plantas baseado na rega
function checkPlantGrowth() {
  const currentTime = Date.now()
  let plantsUpdated = false

  Object.entries(gameState.plantedSeeds).forEach(([index, plantInfo]) => {
    if (plantInfo.isDead) return

    const config = PLANT_GROWTH_CONFIG[plantInfo.seedType]

    // Só verifica crescimento se a planta foi regada e ainda pode crescer
    if (
      plantInfo.watered &&
      plantInfo.currentStage < config.stages.length - 1
    ) {
      const timeSinceStageStart = currentTime - plantInfo.nextStageStartTime

      // Se passou tempo suficiente desde que foi regada, cresce para o próximo estágio
      if (timeSinceStageStart >= config.stageTime) {
        plantInfo.currentStage++
        plantInfo.watered = false // Precisa regar novamente para o próximo estágio
        updateCellVisual(parseInt(index))
        plantsUpdated = true

        if (plantInfo.currentStage === config.stages.length - 1) {
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
  const sellPrice = SELL_PRICES[plantInfo.seedType]

  GameState.addMoney(sellPrice)
  gameState.grid[index] = 'empty'
  delete gameState.plantedSeeds[index]

  updateCellVisual(index)
  updateUI()

  showMessage(`${config.name} colhida! +$${sellPrice}`)
}

// Cria dados iniciais de uma planta plantada
function createPlantData(seedType) {
  return {
    seedType: seedType,
    plantedAt: Date.now(),
    currentStage: 0,
    watered: false,
    isDead: false,
    nextStageStartTime: Date.now(),
  }
}

// Planta uma semente na célula especificada
function plantSeed(index, seedType) {
  gameState.inventory[seedType]--
  gameState.grid[index] = `planted-${seedType}`
  gameState.plantedSeeds[index] = createPlantData(seedType)

  updateCellVisual(index)
  showMessage('Semente plantada!')

  // Verifica se esgotou sementes
  if (gameState.inventory[seedType] === 0) {
    gameState.selectedSeed = null
    updateSeedVisuals()
    showMessage('Sementes esgotadas! Compre mais na loja.')
  }
}

// Rega uma planta
function waterPlant(index) {
  const plantInfo = gameState.plantedSeeds[index]
  if (plantInfo && !plantInfo.isDead && !plantInfo.watered) {
    plantInfo.watered = true
    plantInfo.nextStageStartTime = Date.now()
    showMessage('Planta regada!')
    return true
  }
  return false
}

// Mata plantas que não foram regadas quando o dia avança
function killUnwateredPlants() {
  let plantsKilled = 0

  Object.entries(gameState.plantedSeeds).forEach(([index, plantInfo]) => {
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
