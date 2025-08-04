// ==========================================
// SISTEMA DE PROGRESSÃO (DIAS E TIMERS)
// ==========================================

// Avança um dia, recupera energia e mata plantas não regadas
function advanceDay() {
  GameState.nextDay()
  killUnwateredPlants()
  updateUI()
  showMessage(`Dia ${gameState.currentDay} começou! Energia recuperada.`)
}

// Configura o botão de avançar dia
function setupDayAdvancement() {
  const advanceDayBtn = document.getElementById('advance-day')
  advanceDayBtn.addEventListener('click', () => {
    advanceDay()
  })
}
