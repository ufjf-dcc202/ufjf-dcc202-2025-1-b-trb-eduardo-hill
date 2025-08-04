// ==========================================
// SISTEMA DE INTERFACE E ECONOMIA
// ==========================================

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
  if (GameState.hasMoney(cost)) {
    GameState.spendMoney(cost)
    gameState.inventory[seedType]++
    updateUI()
    showMessage(`${seedName} comprada por $${cost}!`)
  } else {
    showMessage(`Dinheiro insuficiente! Precisa de $${cost}.`)
  }
}

// Processa compra de bateria
function buyBattery() {
  const batteryCost = SPECIAL_ITEMS.battery.price
  const energyBoost = SPECIAL_ITEMS.battery.energyBoost

  if (GameState.hasMoney(batteryCost)) {
    GameState.spendMoney(batteryCost)

    // Aumenta o limite máximo de energia permanentemente
    GameState.increaseMaxEnergy(energyBoost)

    updateUI()
    showMessage(
      `Bateria comprada! Limite máximo de energia aumentado para ${gameState.maxEnergy}!`
    )
  } else {
    showMessage(`Dinheiro insuficiente! Precisa de $${batteryCost}.`)
  }
}

// Configura event listeners para a loja
function setupShopEventListeners() {
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

  // Botões de compra de sementes
  const buySeed1Btn = document.querySelector('.buy-seed1-button')
  const buySeed2Btn = document.querySelector('.buy-seed2-button')
  const buySeed3Btn = document.querySelector('.buy-seed3-button')
  const buyBatteryBtn = document.querySelector('.buy-battery-button')

  buySeed1Btn.addEventListener('click', () => {
    buySeed('seed1', BUY_PRICES.seed1, SEED_NAMES.seed1)
  })

  buySeed2Btn.addEventListener('click', () => {
    buySeed('seed2', BUY_PRICES.seed2, SEED_NAMES.seed2)
  })

  buySeed3Btn.addEventListener('click', () => {
    buySeed('seed3', BUY_PRICES.seed3, SEED_NAMES.seed3)
  })

  buyBatteryBtn.addEventListener('click', () => {
    buyBattery()
  })
}
