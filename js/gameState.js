// ==========================================
// ESTADO DO JOGO
// ==========================================

// Gera grid inicial com pedras e ervas daninhas
function generateInitialGrid() {
  const grid = new Array(GAME_CONFIG.GRID_SIZE)

  for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
    const random = Math.random()
    if (random < GAME_CONFIG.WEED_PROBABILITY) {
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
  currentMoney: GAME_CONFIG.INITIAL_MONEY,
  currentEnergy: GAME_CONFIG.MAX_ENERGY,
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

// Funções para manipular o estado do jogo
const GameState = {
  // Verifica se há energia suficiente
  hasEnergy(amount) {
    return gameState.currentEnergy >= amount
  },

  // Consome energia
  consumeEnergy(amount) {
    gameState.currentEnergy -= amount
  },

  // Verifica se há dinheiro suficiente
  hasMoney(amount) {
    return gameState.currentMoney >= amount
  },

  // Consome dinheiro
  spendMoney(amount) {
    gameState.currentMoney -= amount
  },

  // Adiciona dinheiro
  addMoney(amount) {
    gameState.currentMoney += amount
  },

  // Restaura energia completamente
  restoreEnergy() {
    gameState.currentEnergy = GAME_CONFIG.MAX_ENERGY
  },

  // Avança um dia
  nextDay() {
    gameState.currentDay++
    this.restoreEnergy()
  },
}
