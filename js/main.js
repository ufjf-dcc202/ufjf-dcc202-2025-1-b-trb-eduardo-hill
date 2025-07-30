const gameState = {
  grid: new Array(144).fill('empty'),
}

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', function () {
  createGrid()
})

// Criar grid 12x12
function createGrid() {
  const container = document.getElementById('game-grid')
  container.innerHTML = ''

  for (let i = 0; i < 144; i++) {
    const cell = document.createElement('div')
    cell.className = 'soil'
    cell.dataset.index = i

    // Clique na célula
    cell.addEventListener('click', function () {
      console.log('Clicou na célula:', i)
    })

    container.appendChild(cell)
  }
}
