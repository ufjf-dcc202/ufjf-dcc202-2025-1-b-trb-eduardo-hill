# 🌾 Farming Game - Stardew Valley Style

![Preview](https://img.shields.io/badge/Status-Concluído-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![Languages](https://img.shields.io/badge/Languages-HTML%2FCSS%2FJS-orange)

Um jogo de fazenda inspirado em Stardew Valley, desenvolvido como projeto acadêmico para a disciplina **DCC202 - Desenvolvimento Web** da UFJF.

## 🎮 **Sobre o Jogo**

Gerencie sua própria fazenda! Plante sementes, cuide das plantas, colete recursos e expanda sua energia para se tornar o melhor fazendeiro.

### **Características Principais:**

- 🏡 **Grid de fazenda 12x12** com terrenos variados
- 🔧 **Sistema de ferramentas** (Enxada, Picareta, Tesoura, Regador)
- 🌱 **3 tipos de plantas** com crescimento em tempo real
- ⚡ **Sistema de energia dinâmica** com upgrades
- 💰 **Economia completa** com compra/venda
- 🔋 **Power-ups de bateria** para aumentar energia máxima

## 🚀 **Como Jogar**

### **Controles:**

1. **Selecione uma ferramenta** clicando nos ícones da esquerda
2. **Prepare o terreno**: Use a picareta em pedras, tesoura em ervas
3. **Are o solo** com a enxada
4. **Plante sementes** selecionando-as no inventário direito
5. **Regue as plantas** para iniciar o crescimento
6. **Colete plantas maduras** clicando nelas
7. **Compre itens** na loja (ícone do carrinho)

### **Sistema de Energia:**

- Cada ação de terreno consome energia
- Regar e plantar são **gratuitos**
- Avance o dia para recuperar energia
- Compre baterias para aumentar energia máxima permanentemente

## 🛠️ **Tecnologias Utilizadas**

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com Grid Layout
- **JavaScript ES6+**: Lógica modular e orientada a objetos
- **Arquitetura Modular**: 8 módulos especializados

## 📁 **Estrutura do Projeto**

```
📦 ufjf-dcc202-2025-1-b-trb-eduardo-hill/
├── 📄 index.html              # Página principal
├── 📄 README.md               # Documentação
├── 📂 assets/images/          # Recursos visuais
│   ├── 🥕 Carrot.png          # Ícones de plantas
│   ├── 🌽 Corn.png
│   ├── 🍅 Tomato.png
│   ├── 🔧 hoe.png             # Ícones de ferramentas
│   ├── ⛏️ pickax.png
│   ├── ✂️ garden-scissors.png
│   ├── 🪣 watering-can.png
│   ├── 💰 Gold.png            # Interface
│   ├── 🔋 battery.png
│   └── 🛒 Shopping-Cart.png
├── 📂 styles/                 # Estilos CSS
│   ├── 🎨 styles.css          # Importações principais
│   ├── 📱 reset.css           # Reset CSS
│   ├── 🏠 header.css          # Cabeçalho
│   ├── 🌐 grid-area.css       # Grid do jogo
│   ├── 🔧 tools-inventory.css # Inventário de ferramentas
│   ├── 🌱 seed-inventory.css  # Inventário de sementes
│   └── 🛒 shop-modal.css      # Modal da loja
└── 📂 js/                     # Lógica JavaScript
    ├── ⚙️ config.js           # Configurações e constantes
    ├── 🎯 gameState.js        # Estado global do jogo
    ├── 🌐 grid.js             # Sistema de grid visual
    ├── 🌱 plants.js           # Sistema de plantas
    ├── 🔧 tools.js            # Sistema de ferramentas
    ├── 🎛️ selection.js        # Sistema de seleção
    ├── 🖥️ ui.js               # Interface e economia
    ├── ⏰ gameLoop.js          # Progressão temporal
    └── 🚀 main.js             # Inicialização
```

## 🎯 **Funcionalidades Implementadas**

### **Core Gameplay:**

- ✅ Sistema de grid interativo 12x12
- ✅ 4 ferramentas funcionais com energia seletiva
- ✅ 3 tipos de sementes com crescimento temporal
- ✅ Sistema de inventário visual
- ✅ Economia com compra/venda

### **Sistemas Avançados:**

- ✅ Crescimento de plantas em tempo real
- ✅ Sistema de dias com recuperação de energia
- ✅ Loja completa com sementes e power-ups
- ✅ Sistema de energia dinâmica com upgrades
- ✅ Interface responsiva e acessível

### **Arquitetura:**

- ✅ Código modular em 8 arquivos especializados
- ✅ Separação clara de responsabilidades
- ✅ Configurações centralizadas
- ✅ Sistema de estado global eficiente

## 💰 **Sistema Econômico**

| Item       | Preço Compra | Preço Venda | Tempo Crescimento  |
| ---------- | ------------ | ----------- | ------------------ |
| 🥕 Cenoura | $20          | $35         | 5 segundos         |
| 🌽 Milho   | $30          | $50         | 8 segundos         |
| 🍅 Tomate  | $40          | $70         | 10 segundos        |
| 🔋 Bateria | $1000        | -           | +50 energia máxima |

## ⚡ **Sistema de Energia**

| Ação                    | Custo de Energia |
| ----------------------- | ---------------- |
| ⛏️ Quebrar pedra        | 20 energia       |
| ✂️ Remover erva         | 10 energia       |
| 🔧 Arar solo            | 5 energia        |
| 🔧 Remover planta morta | 8 energia        |
| 🪣 Regar planta         | **Gratuito**     |
| 🌱 Plantar semente      | **Gratuito**     |

## 🚀 **Como Executar**

1. **Clone o repositório:**

```bash
git clone https://github.com/ufjf-dcc202/ufjf-dcc202-2025-1-b-trb-eduardo-hill.git
```

2. **Navegue até o diretório:**

```bash
cd ufjf-dcc202-2025-1-b-trb-eduardo-hill
```

3. **Execute o jogo:**
   - Abra `index.html` no seu navegador
   - Ou use um servidor local como Live Server (VS Code)

## 📋 **Requisitos Técnicos**

- ✅ **Navegador moderno** com suporte a ES6+
- ✅ **JavaScript habilitado**
- ✅ **Resolução mínima**: 1024x768px
- ✅ **Sem dependências externas**

## 👥 **Desenvolvimento**

**Desenvolvido por:** Eduardo Hill  
**Disciplina:** DCC202 - Desenvolvimento Web  
**Professor:** Igor Knop  
**Instituição:** Universidade Federal de Juiz de Fora (UFJF)  
**Período:** 2025.1

## 📄 **Licença**

Este projeto foi desenvolvido para fins acadêmicos como parte da avaliação da disciplina DCC202.

---

**🌾 Divirta-se cultivando sua fazenda virtual! 🌾**
