const body = document.querySelector('body')
const container = document.querySelector('.container')
const game = document.querySelector('.game')
const score = document.querySelector('.score')
const btn = document.querySelector('.btn')
const header = document.querySelector('.header')
const preview = document.querySelector('.preview')
const speedVal = document.querySelector('.speed-value')
const speedUp = document.querySelector('.speed-up')
const speedDown = document.querySelector('.speed-down')
const lightSwitch = document.querySelector('.switch')
const width = 10


var interval = 1000
var speed = 1
var grid = []
var previewGrid = []

lightSwitch.addEventListener('click', () => {
  console.log(lightSwitch.checked)
  if(lightSwitch.checked){
    body.style.background = 'radial-gradient(#a1bca6 ,#74c0b2)'
    body.style.color = '#3c926c'
    game.style.backgroundColor = 'rgba(0, 0, 0, .1)'
  }else{
    body.style.background = 'black'
    body.style.color = '#c0e7d6'
    game.style.backgroundColor = 'rgba(255, 255, 255, .2)'
  }
})

for(let i=0; i<200 ; i++){
  grid[i] = game.appendChild(document.createElement('div'))
}

for(let i=200; i<210 ; i++){
  grid[i] = game.appendChild(document.createElement('div'))
  grid[i].classList.add('taken')
}

for(let i=0; i<16 ; i++){
  previewGrid[i] = preview.appendChild(document.createElement('div'))
}

const L_tetrominoes = [
  [1, 11, 21, 22],
  [10, 11, 12, 20],
  [0, 1, 11, 21],
  [2, 10, 11, 12]
]

const J_tetrominoes = [
  [1, 11, 20, 21],
  [10, 20, 21, 22],
  [1, 2, 11, 21],
  [10, 11, 12, 22],
]

const S_tetrominoes = [
  [1, 2, 10, 11],
  [1, 11, 12, 22],
  [11, 12, 20, 21],
  [0, 10, 11, 21]
]

const Z_tetrominoes = [
  [0, 1, 11, 12],
  [2, 11, 12, 21],
  [10, 11, 21, 22],
  [1, 10, 11, 20]
]

const T_tetrominoes = [
  [1, 10, 11, 12],
  [1, 11, 12, 21],
  [10, 11, 12, 21],
  [1, 10, 11, 21]
]

const O_tetrominoes = [
  [1, 2, 11, 12],
  [1, 2, 11, 12],
  [1, 2, 11, 12],
  [1, 2, 11, 12]
]

const I_tetrominoes = [
  [1, 11, 21, 31],
  [10, 11, 12, 13],
  [1, 11, 21, 31],
  [10, 11, 12, 13]
]

const previewL = [1, 5, 9, 10]
const previewJ = [1, 5, 8, 9]
const previewS = [1, 2, 4, 5]
const previewZ = [0, 1, 5, 6]
const previewT = [1, 4, 5, 6]
const previewO = [1, 2, 5, 6]
const previewI = [1, 5, 9, 13]

const tetrominoes = [L_tetrominoes, J_tetrominoes, S_tetrominoes, Z_tetrominoes, T_tetrominoes, O_tetrominoes, I_tetrominoes]

const previewTetros = [previewL, previewJ, previewS, previewZ, previewT, previewO, previewI]

var currentPosition = 3
var currentShape = Math.floor(Math.random()*7)
var currentRotation = 0
var currentTetro = tetrominoes[currentShape][currentRotation]
var current = currentTetro.map(x => x+currentPosition)
var isAtLeftEdge = current.some(i => i % width == 0)
var isAtRightEdge = current.some(i => i % width == width - 1)
var linesClear = 0
var highest = 0
var isGameOver = false
var isGamePaused = true
var upNextShape = Math.floor(Math.random()*7)
var upNextTetro = previewTetros[upNextShape]
var currentColor = 0
var upNextColor = 1
var colors = [
  'linear-gradient(135deg,#d0c1f8,#5523f7)',
  'linear-gradient(135deg,#f7c3e9,#f529be)',
  'linear-gradient(135deg,#facdc4,#fa5433)',
  'linear-gradient(135deg,#f1f5c0,#edfa31)',
  'linear-gradient(135deg,#b7e8f7,#20c3fa)',
  'linear-gradient(135deg,#bff8e2,#1cf5a2)']

var timer = 0 

document.addEventListener('keydown', (e) => {
  if(!isGamePaused){
    if(e.key==='ArrowLeft'||e.key==='a'){
      moveLeft()
    }else if(e.key==='ArrowRight'||e.key==='d'){
      moveRight()
    }else if(e.key==='ArrowDown'||e.key==='s'){
      moveDown()
    }else if(e.key==='ArrowUp'||e.key==='w'){
      rotate()
    }
  }
})

speedUp.addEventListener('click', () => {
  if(speed < 5 && speed > 0.8){
    speed++
  }else if(speed == 0.8){
    speed = 1
  }else if(speed == 0.5){
    speed =0.8
  }
  speedVal.innerHTML = `${speed}x`
  interval = 1000 / speed
  if(!isGamePaused){
    clearInterval(timer)
    timer = setInterval(moveDown,interval)
  }
})

speedDown.addEventListener('click', () => {
  if(speed > 1){
    speed--
  }else if(speed == 1){
    speed = 0.8
  }else if(speed == 0.8){
    speed =0.5
  }
  speedVal.innerHTML = `${speed}x`
  interval = 1000 / speed
  if(!isGamePaused){
    clearInterval(timer)
    timer = setInterval(moveDown,interval)
  }
})

btn.addEventListener('click', () => {
  if(isGameOver){
    for(let i=0; i<200 ; i++){
      grid[i].classList.remove('tetromino','taken')
      grid[i].style.background = ''
    }
    linesClear = 0
    score.innerHTML = `Lines Clear : 0 <br/> Current Score : 0 <br/>Highest Score : ${highest}`
    game.style.setProperty('--over-display', 'none')
    draw()
    timer = setInterval(moveDown,interval)
    isGameOver = false
    isGamePaused = false
    btn.innerHTML = `Pause Game`
  }else if(timer){
    clearInterval(timer)
    timer = 0
    isGamePaused = true
    btn.innerHTML = `Continue`
  }else{
    upNextTetro.forEach(i => {
      previewGrid[i].classList.add('tetromino')
      previewGrid[i].style.background = colors[upNextColor]
    })
    draw()
    timer = setInterval(moveDown,interval)
    isGamePaused = false
    btn.innerHTML = `Pause Game`
  }
})

function draw(){
  current.forEach(i => {
    grid[i].classList.add('tetromino')
    grid[i].style.background = colors[currentColor]
  })
}

function undraw(){
  current.forEach(i => {
    grid[i].classList.remove('tetromino')
    grid[i].style.background = ''
  })
}

function moveLeft(){
  undraw()
  isAtLeftEdge = current.some(i => i % width == 0)
  if(!isAtLeftEdge){
    currentPosition--
    current = currentTetro.map(x => x+currentPosition)
    if(currentPosition > 0 && current.some(x => grid[x].classList.contains('taken'))){
      currentPosition++
      current = currentTetro.map(x => x+currentPosition)
    }
  }
  draw()
}

function moveRight(){
  undraw()
  isAtRightEdge = current.some(i => i % width == width - 1)
  if(!isAtRightEdge){
    currentPosition++
    current = currentTetro.map(x => x+currentPosition)
    if(current.some(x => grid[x].classList.contains('taken'))){
      currentPosition--
      current = currentTetro.map(x => x+currentPosition)
    }
  }
  draw()
}

function moveDown(){
  let check = current.map(x => x+width).some(x =>grid[x].classList.contains('taken'))
  if(check){
    freeze()
  }else{
    undraw()
    currentPosition += width
  }
  current = currentTetro.map(x => x+currentPosition)
  draw()
}

function rotate(){
  undraw()
  let preRotate = current
  let preRotatePosition = currentPosition
  let preRotateRotation = currentRotation
  if(currentRotation < 3){
    currentRotation++
  }else{
    currentRotation = 0
  }
  isAtLeftEdge = current.some(i => i % width == 0)
  isAtRightEdge = current.some(i => i % width == width - 1)
  if(isAtLeftEdge && currentPosition % width == width - 1){
    currentPosition++
  }else if(isAtRightEdge){
    if(currentShape == 6){
      currentPosition -= currentPosition % width - 6
    }else{
      currentPosition -= currentPosition % width - 7
    }
  }else if(currentShape == 6 && currentPosition % width == 7){
    currentPosition -= currentPosition % width - 6
  }
  currentTetro = tetrominoes[currentShape][currentRotation]
  current = currentTetro.map(x => x+currentPosition)
  if(current.some(x => grid[x].classList.contains('taken'))){
    current = preRotate
    currentPosition = preRotatePosition
    currentRotation = preRotateRotation
    currentTetro = tetrominoes[currentShape][currentRotation]
  }
  draw()
}

function freeze(){
  current.forEach(x => grid[x].classList.add('taken'))
  for(let i = 0; i < 20; i++){
    if(grid.slice(width*i, width*(i+1)).every(div => div.classList.contains('taken'))){
      grid.splice(width*i, width)
      let row = []
      for(let j = 0;j < width; j++){
        row[j] = document.createElement('div')
      }
      grid = row.concat(grid)
      game.innerHTML = ``
      grid.forEach(x => game.appendChild(x))
      linesClear++
      highest = Math.max(linesClear * width, highest)
      score.innerHTML = `Lines Clear : ${linesClear}<br/>Current Score : ${linesClear * width}<br/>Highest Score : ${highest}`
    }
  }
  currentPosition = 3
  currentShape = upNextShape
  currentColor = upNextColor
  currentRotation = 0
  currentTetro = tetrominoes[currentShape][currentRotation]
  current = currentTetro.map(x => x+currentPosition)
  upNextTetro.forEach(i => {
    previewGrid[i].classList.remove('tetromino')
    previewGrid[i].style.background = ''
  })
  upNextShape = Math.floor(Math.random()*7)
  upNextTetro = previewTetros[upNextShape]
  if(upNextColor == colors.length-1){
    upNextColor = 0
  }else{
    upNextColor++
  }
  upNextTetro.forEach(i => {
    previewGrid[i].classList.add('tetromino')
    previewGrid[i].style.background = colors[upNextColor]
  })
  gameOver()
}

function gameOver(){
  if(current.some(x => grid[x].classList.contains('taken'))){
    clearInterval(timer)
    timer = 0
    isGameOver = true
    isGamePaused = true
    btn.innerHTML = `Restart`
    game.style.setProperty('--over-display', 'flex')
  }
}




