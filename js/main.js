// ==========================================
// INICIALIZAÇÃO DO JOGO
// ==========================================

// Configura event listeners para ferramentas e sementes
function setupGameEventListeners() {
  // Event listeners para ferramentas
  document.querySelectorAll('[data-tool]').forEach((toolSlot) => {
    toolSlot.addEventListener('click', function () {
      const toolType = this.dataset.tool
      selectTool(toolType)
    })
  })

  // Event listeners para sementes
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
}

// Inicialização principal do jogo
function initializeGame() {
  createGrid()
  updateUI()
  startPlantGrowthTimer()
  setupGameEventListeners()
  setupShopEventListeners()
  setupDayAdvancement()
}

// Inicia o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeGame)
