// ==========================================
// SISTEMA DE SELEÇÃO (FERRAMENTAS E SEMENTES)
// ==========================================

// Gerencia seleção e desseleção de sementes
function selectSeed(seedType) {
  if (gameState.selectedSeed === seedType) {
    gameState.selectedSeed = null
    showMessage('Semente desselecionada')
  } else {
    gameState.selectedSeed = seedType
    showMessage(`${SEED_NAMES[seedType]} selecionada`)
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
    showMessage(`${TOOL_NAMES[toolType]} selecionada`)
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
