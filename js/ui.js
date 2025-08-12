// ==========================================
// SISTEMA DE INTERFACE E ECONOMIA
// ==========================================

// Função auxiliar para realizar compras
function processPurchase(cost, onSuccess, itemName) {
  if (GameState.hasMoney(cost)) {
    GameState.spendMoney(cost)
    onSuccess()
    updateUI()
    return true
  } else {
    showMessage(`Dinheiro insuficiente! Precisa de $${cost}.`)
    return false
  }
}

// Atualiza informações do HUD (dinheiro, energia, dia, inventário)
function updateUI() {
  const energyDisplay = document.querySelector('#energy-display span')
  if (energyDisplay) {
    energyDisplay.textContent = `${gameState.currentEnergy}/${gameState.maxEnergy}`
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
  processPurchase(cost, () => {
    gameState.inventory[seedType]++
    showMessage(`${seedName} comprada por $${cost}!`)
  })
}

// Processa compra de bateria
function buyBattery() {
  const batteryCost = SPECIAL_ITEMS.battery.price
  const energyBoost = SPECIAL_ITEMS.battery.energyBoost

  processPurchase(batteryCost, () => {
    GameState.increaseMaxEnergy(energyBoost)
    showMessage(
      `Bateria comprada! Limite máximo de energia aumentado para ${gameState.maxEnergy}!`
    )
  })
}

// Configura event listeners para a loja
function setupShopEventListeners() {
  const modal = document.getElementById('shop-modal')

  // Modal abrir/fechar
  document.getElementById('seed-shop-button').addEventListener('click', () => {
    modal.style.display = 'block'
  })

  document.getElementById('close-shop-modal').addEventListener('click', () => {
    modal.style.display = 'none'
  })

  // Botões de compra de sementes - usando loop para evitar repetição
  const seedTypes = ['seed1', 'seed2', 'seed3']
  seedTypes.forEach((seedType) => {
    const buyBtn = document.querySelector(`.buy-${seedType}-button`)
    buyBtn.addEventListener('click', () => {
      buySeed(seedType, BUY_PRICES[seedType], SEED_NAMES[seedType])
    })
  })

  // Botão de compra de bateria
  document
    .querySelector('.buy-battery-button')
    .addEventListener('click', () => {
      buyBattery()
    })
}
