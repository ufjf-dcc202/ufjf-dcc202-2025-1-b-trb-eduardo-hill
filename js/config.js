// ==========================================
// CONFIGURAÇÕES E CONSTANTES
// ==========================================

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

// Preços de venda das culturas
const SELL_PRICES = {
  seed1: 35,
  seed2: 50,
  seed3: 70,
}

// Preços de compra das sementes
const BUY_PRICES = {
  seed1: 20,
  seed2: 30,
  seed3: 40,
}

// Preços de itens especiais
const SPECIAL_ITEMS = {
  battery: {
    price: 1000,
    energyBoost: 50,
    name: 'Bateria de Energia',
  },
}

// Custos de energia das ferramentas
const ENERGY_COSTS = {
  pickax: 20,
  'garden-scissors': 10,
  hoe: 5,
  hoeDeadPlant: 8,
  'watering-can': 0,
}

// Nomes das ferramentas para mensagens
const TOOL_NAMES = {
  hoe: 'Enxada',
  pickax: 'Picareta',
  'garden-scissors': 'Tesoura',
  'watering-can': 'Regador',
}

// Nomes das sementes para mensagens
const SEED_NAMES = {
  seed1: 'Cenoura',
  seed2: 'Milho',
  seed3: 'Tomate',
}

// Configurações do jogo
const GAME_CONFIG = {
  GRID_SIZE: 144,
  MAX_ENERGY: 50,
  INITIAL_MONEY: 100,
  WEED_PROBABILITY: 0.1,
  MESSAGE_DURATION: 3000,
}
