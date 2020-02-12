// Variables/Constants
console.log('connected to game-layout')
// Title
const titleDiv = document.getElementById('title-div')
const mainDiv = document.getElementById('main')
const avatarForm = document.getElementById('avatar-form')
const avatarInput = document.getElementById('avatar-input')

// Chat
const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')
const chatBox = document.getElementById('chat-box')
const chatMsg = document.getElementById('chat-messages')
const chatDiv = document.getElementById('chat-div')

// Lobby
var lobbyName = 'Global'
const lobbyDiv = document.getElementById('lobby-div')
const lobbyForm = document.getElementById('lobby-form')
const lobbyInput = document.getElementById('lobby-input')

const currentLobbyDiv = document.getElementById('current-lobby-div')
const currentLobbyBox = document.getElementById('current-lobby-box')
const lobbyMembers = document.getElementById('lobby-members')

// Start Game
const startDiv = document.getElementById('start-div')
const startForm = document.getElementById('start-form')
const ingameDiv = document.getElementById('ingame-div')

// Guess drawing
var guessedWord
var guessForm = document.getElementById('guess-form')
var guessTextBox = document.getElementById('guess-text') 
var guessDiv = document.getElementById('guess-div')
var submitGuess = document.getElementById('guess-button')

// Word
const wordDiv = document.getElementById('word-div')
var word

// Drawing Board
const drawingBoard = document.getElementById('drawing-board')

// Round Instructions
const instructions = document.getElementById('instructions')
var instructionMessage = document.getElementById('instruction-message')

// Timer
const timer = document.getElementById('timer')
var timerText = document.getElementById('timer-text')
var countdown

// Finish Drawing Button
const finishDrawDiv = document.getElementById('finish-draw-div')
const finishButton = document.getElementById('finish-button')

function setupHomepage(){
    mainDiv.classList.remove('container-fluid')
    mainDiv.classList.add('container')
    currentLobbyDiv.style.display = 'none'
    wordDiv.style.display = 'none'
    startDiv.style.display = 'none'
    ingameDiv.style.display = 'none'
    titleDiv.classList.add('bounceInDown')
    titleDiv.addEventListener('animationend', ()=>
    {titleDiv.classList.remove('bounceInDown')})

    lobbyDiv.classList.add('fadeIn', 'delay-1s')
    lobbyDiv.addEventListener('animationend', ()=>
    {lobbyDiv.classList.remove('fadeIn')})

    chatDiv.classList.remove('col-3')
    chatDiv.classList.add('col-4')
    chatDiv.classList.add('slideInLeft')
    chatDiv.addEventListener('animationend', ()=>
    {chatDiv.classList.remove('slideInLeft')})  
    /*
    //chatDiv.classList.remove('order-first')  
    //chatDiv.classList.add('order-last')
    //chatDiv.classList.add('slideInRight')
    
    chatDiv.addEventListener('animationend', ()=>
    {
        if(chatDiv.classList.contains('slideInLeft')){
            chatDiv.classList.remove('slideInLeft')
        }
        else{
            chatDiv.classList.remove('slideInRight')
        }
    })  
    */
    lobbyForm.style.display = 'block'

    drawingBoard.classList.add('slideInUp')
    drawingBoard.addEventListener('animationend', ()=>
    {drawingBoard.classList.remove('slideInUp')})  

    instructions.style.display = 'none'
}

function setupGamepage(){
    mainDiv.classList.remove('container')
    mainDiv.classList.add('container-fluid')
    startDiv.style.display = 'block'
    ingameDiv.style.display = 'block'

    currentLobbyDiv.style.display = 'block'
    currentLobbyDiv.classList.add('bounceInRight')
    currentLobbyDiv.addEventListener('animationend', ()=>
    {currentLobbyDiv.classList.remove('bounceInRight')})

    chatDiv.classList.remove('col-4')
    chatDiv.classList.add('col-3')
    //chatDiv.classList.remove('order-last')
    //chatDiv.classList.add('order-first')
    chatDiv.classList.add('slideInLeft')
    avatarForm.style.display = 'none'
    lobbyForm.style.display = 'none'
    drawingBoard.style.display = 'none'
    guessDiv.style.display = 'none'
    finishDrawDiv.style.display = 'none'
    instructions.style.display = 'block'
}

function setupWordBank(){
    wordDiv.style.display = 'block'
    startDiv.style.display = 'none'
}

function setupDraw(){
    titleDiv.style.display = 'none'
    guessDiv.style.display = 'none'
    drawingBoard.style.display = 'block'
    //drawingBoard.classList.add('slideInUp')
    //chatDiv.classList.add('slideInLeft')
    //currentLobbyDiv.classList.add('bounceInRight')
    finishDrawDiv.style.display = 'block'
}

function setupGuess(){
    finishDrawDiv.style.display = 'none'
    guessDiv.style.display = 'block'
    startTimer(20, 'guessing')   
}

guessForm.addEventListener('submit', e=>{
    e.preventDefault()
    guessedWord = guessTextBox.value;
    sendGuess(guessedWord)
    console.log(`You guessed: ${guessedWord}`)
    guessTextBox.value = ''
    finishedEvent('guessing')
})

finishButton.addEventListener('click', ()=>{
    finishedEvent('drawing')
})