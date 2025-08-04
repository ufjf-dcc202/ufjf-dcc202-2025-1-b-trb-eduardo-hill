// ==========================================
// SISTEMA DE FERRAMENTAS E INTERAÇÕES
// ==========================================

// Gerencia cliques nas células do grid - ferramentas, plantio e colheita
function handleCellClick(index) {
  const cellType = gameState.grid[index]

  if (gameState.currentEnergy <= 0) {
    showMessage('Sem energia! Avance o dia para recuperar.')
    return
  }

  // Lógica das ferramentas
  if (gameState.selectedTool) {
    handleToolAction(index, cellType)
  }
  // Lógica de plantio
  else if (gameState.selectedSeed) {
    handleSeedPlanting(index, cellType)
  }
  // Lógica de colheita (sem ferramenta/semente selecionada)
  else {
    handleHarvesting(index, cellType)
  }

  updateUI()
}

// Gerencia ações das ferramentas
function handleToolAction(index, cellType) {
  switch (gameState.selectedTool) {
    case 'pickax':
      handlePickaxAction(index, cellType)
      break
    case 'garden-scissors':
      handleScissorsAction(index, cellType)
      break
    case 'hoe':
      handleHoeAction(index, cellType)
      break
    case 'watering-can':
      handleWateringAction(index, cellType)
      break
  }
}

// Ação da picareta
function handlePickaxAction(index, cellType) {
  if (cellType === 'rock') {
    const energyCost = ENERGY_COSTS.pickax
    if (GameState.hasEnergy(energyCost)) {
      GameState.consumeEnergy(energyCost)
      gameState.grid[index] = 'empty'
      updateCellVisual(index)
      showMessage('Pedra removida!')
    } else {
      showMessage(`Energia insuficiente! Precisa de ${energyCost} energia.`)
    }
  } else {
    showMessage('Use a picareta apenas em pedras!')
  }
}

// Ação da tesoura
function handleScissorsAction(index, cellType) {
  if (cellType === 'weed') {
    const energyCost = ENERGY_COSTS['garden-scissors']
    if (GameState.hasEnergy(energyCost)) {
      GameState.consumeEnergy(energyCost)
      gameState.grid[index] = 'empty'
      updateCellVisual(index)
      showMessage('Erva daninha removida!')
    } else {
      showMessage(`Energia insuficiente! Precisa de ${energyCost} energia.`)
    }
  } else {
    showMessage('Use a tesoura apenas em ervas daninhas!')
  }
}

// Ação da enxada
function handleHoeAction(index, cellType) {
  if (cellType === 'empty') {
    const energyCost = ENERGY_COSTS.hoe
    if (GameState.hasEnergy(energyCost)) {
      GameState.consumeEnergy(energyCost)
      gameState.grid[index] = 'tilled'
      updateCellVisual(index)
      showMessage('Solo preparado para plantio!')
    } else {
      showMessage(`Energia insuficiente! Precisa de ${energyCost} energia.`)
    }
  } else if (
    cellType === 'dead-plant' ||
    (cellType.startsWith('planted-') && gameState.plantedSeeds[index]?.isDead)
  ) {
    const energyCost = ENERGY_COSTS.hoeDeadPlant
    if (GameState.hasEnergy(energyCost)) {
      GameState.consumeEnergy(energyCost)
      gameState.grid[index] = 'tilled'
      delete gameState.plantedSeeds[index]
      updateCellVisual(index)
      showMessage('Planta morta removida e solo preparado!')
    } else {
      showMessage(`Energia insuficiente! Precisa de ${energyCost} energia.`)
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
}

// Ação do regador
function handleWateringAction(index, cellType) {
  if (cellType === 'empty' || cellType === 'tilled') {
    showMessage('Nada para regar aqui!')
  } else if (cellType.startsWith('planted-')) {
    const plantInfo = gameState.plantedSeeds[index]
    if (plantInfo && !plantInfo.isDead) {
      if (!plantInfo.watered) {
        waterPlant(index)
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
}

// Gerencia plantio de sementes
function handleSeedPlanting(index, cellType) {
  if (cellType === 'tilled') {
    if (gameState.inventory[gameState.selectedSeed] > 0) {
      plantSeed(index, gameState.selectedSeed)
    } else {
      showMessage('Você não tem essa semente!')
    }
  } else {
    showMessage('Prepare o solo com a enxada primeiro!')
  }
}

// Gerencia colheita de plantas
function handleHarvesting(index, cellType) {
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
}
