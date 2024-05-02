/* eslint-disable indent */
import './style.css'
import { BLOCK_SIZE, BOARD__WIDTH, BOARD__HEIGHT, EVENT_MOVEMENTS } from './public/consts'

// 1- inicializamos canvas

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')

// elementos

// eslint-disable-next-line no-unused-vars
let score = 0

canvas.width = BLOCK_SIZE * BOARD__WIDTH
canvas.height = BLOCK_SIZE * BOARD__HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)
const board = createBoard(BLOCK_SIZE, BLOCK_SIZE)

 function createBoard (width, height) {
    return Array(height).fill().map(() => Array(width).fill(0))
 }

 // piezas

 const piece = {
    position: { x: 5, y: 5 },
    shape: [
        [1, 1],
        [1, 1]
    ]
 }

 // random pieces
 const PIECES = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    [
        [0, 1],
        [0, 1],
        [0, 1]
    ]
]
// game loop
let dropCounter = 0
let lastTime
function update (time = 0) {
    const delateTime = time - lastTime
    lastTime = time

    dropCounter += delateTime

    if (dropCounter > 1000) {
        piece.position.y++
        dropCounter = 0

        if (checkCollision()) {
            piece.position.y--
            solidifyPiece()
            removeRows()
        }
    }

    draw()
    window.requestAnimationFrame(update)
}

function draw () {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = 'yellow'
                context.fillRect(x, y, 1, 1)
            }
        })
    })

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'red'
                context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
            }
        })
    })
    $score.innerText = score
}
document.addEventListener('keydown', event => {
    if (event.key === EVENT_MOVEMENTS.LEFT) {
        piece.position.x--
        if (checkCollision()) {
            piece.position.x++
        }
    }
    if (event.key === EVENT_MOVEMENTS.RIGHT) {
        piece.position.x++
        if (checkCollision()) {
            piece.position.x--
        }
    }
    if (event.key === EVENT_MOVEMENTS.DOWN) {
        piece.position.y++
        if (checkCollision()) {
            piece.position.y--
            solidifyPiece()
            removeRows()
        }
    }
    if (event.key === 'ArrowUp') {
        const rotated = []

        for (let i = 0; i < piece.shape.length; i++) {
            const row = []

        for (let j = piece.shape.length - 1; j >= 0; j--) {
            row.push(piece.shape[j][i])
        }
        rotated.push(row)
        }
        const previousShape = piece.shape
        piece.shape = rotated
        if (checkCollision()) {
            piece.shape = previousShape
        }
}
})

function checkCollision () {
    return piece.shape.find((row, y) => {
        return row.find((value, x) => {
            return (
                value === 0 &&
                board[y + piece.position.y]?.[x + piece.position.x] === 1
            )
        })
    })
}

function solidifyPiece () {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                board[y + piece.position.y][x + piece.position.x] = 1
            }
        })
    })
    // RESET POSITION
    piece.position.x = Math.floor(BOARD__WIDTH / 2 - 2)
    piece.position.y = 0
    // GET RANDOM SHAPE
    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length - 1)]

        // gameOver
    if (checkCollision()) {
    window.alert('Juego terminado')
    board.forEach((row) => row.fill(0))
    }
        }
function removeRows () {
    const rowsToRemove = []

board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
        rowsToRemove.push(y)
    }
})

rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD__WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
})
}

const $section = document.querySelector('section')

$section.addEventListener('click', () => {
    update()

    $section.remove()

    const audio = new window.Audio('./public/utomp3.com - Original Tetris theme Tetris Soundtrack.mp3')
    audio.volume = 0.2
    audio.play()
});