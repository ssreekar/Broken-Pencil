// Variables/Constants
console.log('connected to game-layout')
// Title
const titleHeader = document.getElementById('title-div')
const mainDiv = document.getElementById('main')
const avatarForm = document.getElementById('avatar-form')
const avatarInput = document.getElementById('avatar-input')

// Chat
const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')
const chatBox = document.getElementById('chat-box')
const chatDiv = document.getElementById('chat-div')

// Lobby
var lobbyName = 'Global'
const lobbyDiv = document.getElementById('lobby-div')
const lobbyForm = document.getElementById('lobby-form')
const lobbyInput = document.getElementById('lobby-input')

const currentLobbyDiv = document.getElementById('current-lobby-div')
const currentLobbyBox = document.getElementById('current-lobby-box')
const currentLobby = document.getElementById('current-lobby')
const header = document.getElementById('lobby-members')

// Start Game
const startBtn = document.getElementById('start-button')

// Word
const wordBank = document.getElementById('word-bank')
var word

// Drawing Board
const drawingBoard = document.getElementById('drawing-board')

// Round Instructions
const instructions = document.getElementById('instructions')
var instructionMessage

// Timer
const timer = document.getElementById('timer')
var timerText
var countdown

// Finish Round
const finish = document.getElementById('finish')

function setupHomepage(){
    mainDiv.classList.remove('container-fluid')
    mainDiv.classList.add('container')
    currentLobbyDiv.style.display = 'none'

    titleHeader.classList.add('bounceInDown')
    titleHeader.addEventListener('animationend', ()=>
    {titleHeader.classList.remove('bounceInDown')})

    lobbyDiv.classList.add('fadeIn', 'delay-1s')
    lobbyDiv.addEventListener('animationend', ()=>
    {lobbyDiv.classList.remove('fadeIn')})

    chatDiv.classList.remove('order-first')  
    chatDiv.classList.add('order-last')
    chatDiv.classList.add('slideInRight')
    chatDiv.addEventListener('animationend', ()=>
    {
        if(chatDiv.classList.contains('slideInLeft')){
            chatDiv.classList.remove('slideInLeft')
        }
        else{
            chatDiv.classList.remove('slideInRight')
        }
    })  
    lobbyForm.style.display = 'block'

    drawingBoard.classList.add('slideInUp')
    drawingBoard.addEventListener('animationend', ()=>
    {drawingBoard.classList.remove('slideInUp')})  
}

function setupGamepage(){
    mainDiv.classList.remove('container')
    mainDiv.classList.add('container-fluid')

    currentLobbyDiv.style.display = 'block'
    currentLobbyDiv.classList.add('bounceInRight')
    currentLobbyDiv.addEventListener('animationend', ()=>
    {currentLobbyDiv.classList.remove('bounceInRight')})

    chatDiv.classList.remove('order-last')
    chatDiv.classList.add('order-first')
    drawingBoard.classList.add('slideInUp')
    chatDiv.classList.add('slideInLeft')
    avatarForm.style.display = 'none'
    lobbyForm.style.display = 'none'
    
}


