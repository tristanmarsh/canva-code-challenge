const boardWidth = 40
const boardHeight = 30
const board = document.getElementById("board")
let cherry = generateCherry()

const snake = {
  body: [{ x: boardWidth / 2, y: boardHeight / 2 }],
  direction: { x: 1, y: 0 },
}

function generateCherry() {
  return {
    x: Math.floor(Math.random() * boardWidth),
    y: Math.floor(Math.random() * boardHeight),
  }
}

function renderBoard() {
  const stringify = (input) => JSON.stringify(input)

  const isBody = ({ x, y }) =>
    snake.body.some((pixel) => stringify({ x, y }) === stringify(pixel))

  let newBoard = ""
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (isBody({ x, y })) {
        newBoard += "o"
      } else if (cherry.x === x && cherry.y === y) {
        newBoard += "x"
      } else {
        newBoard += " "
      }
    }
    newBoard += "\n"
  }
  board.textContent = newBoard
}

function step(vectorPos, max, direction) {
  if (direction > 0) {
    return vectorPos < max - 1 ? vectorPos + direction : 0
  }

  return vectorPos < 1 ? max - 1 : vectorPos + direction
}

function gameLoop() {
  const head = snake.body.slice(-1)[0]

  const newHeadPos = {
    x: step(head.x, boardWidth, snake.direction.x),
    y: step(head.y, boardHeight, snake.direction.y),
  }

  // add new head
  snake.body.push(newHeadPos)

  if (head.x === cherry.x && head.y === cherry.y) {
    snake.body.push(head)
    cherry = generateCherry()
  }

  snake.body.shift()

  renderBoard()
}

renderBoard()
setInterval(gameLoop, 50)

const keyToDirection = {
  ArrowUp: { x: 0, y: -1 },
  ArrowRight: { x: 1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
}

document.addEventListener("keydown", (e) => {
  if (keyToDirection[e.key]) {
    snake.direction = keyToDirection[e.key]
  }
})
