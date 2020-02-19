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

const createLobbyDiv = document.getElementById('create-lobby-div')
const createLobbyForm = document.getElementById('create-lobby-form')
var createLobbyModal = document.getElementById('create-lobby-modal')
const newLobbyInput = document.getElementById('new-lobby-input')
const lobbyPasswordInput = document.getElementById('lobby-password-input')
const joinLobbyButton = document.getElementById('join-lobby-button')

const enterPasswordForm = document.getElementById('enter-password-form')
const enterPasswordInput = document.getElementById('enter-password-input')
var passwordModal = document.getElementById('password-modal')

// Start Game
const ingameDiv = document.getElementById('ingame-div')

// Guess drawing
var guessedWord
var guessForm = document.getElementById('guess-form')
var guessTextBox = document.getElementById('guess-text') 
var guessDiv = document.getElementById('guess-div')
var submitGuess = document.getElementById('guess-button')

// Word
var wordDiv = document.getElementById('word-div')
var wordButtons = document.getElementsByClassName('word-button')
var easyButton = document.getElementById('easy-btn')
var mediumButton = document.getElementById('medium-btn')
var hardButton = document.getElementById('hard-btn')
var veryHardButton = document.getElementById('veryHard-btn')
var word

// Drawing Board
const drawingBoard = document.getElementById('drawing-board')

// Round Instructions
const instructions = document.getElementById('instructions')
var instructionMessage = document.getElementById('instruction-message')

// Ready Messages
const members = document.getElementById('members')
let membersMessage = document.getElementById('members-message')

// Timer
const timer = document.getElementById('timer')
var timerText = document.getElementById('timer-text')
var countdown

// Finish Drawing Button
const finishDrawDiv = document.getElementById('finish-draw-div')
const finishButton = document.getElementById('finish-button')

// Final Results
var finalResultsDiv = document.getElementById('final-results-div')
var finalResultsInner = document.getElementById('final-results-inner')
var originalWord = document.getElementById('original-word')

var leaveButtonsDiv = document.getElementById('leave-buttons-div')
var leaveLobbyButton = document.getElementById('leave-lobby-button')
var playAgainButton = document.getElementById('play-again-button')

function setupHomepage(){
    mainDiv.classList.remove('container-fluid')
    mainDiv.classList.add('container')
    currentLobbyDiv.style.display = 'none'
    wordDiv.style.display = 'none'
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
    avatarForm.style.display = 'flex'
    drawingBoard.style.display = 'block'
    drawingBoard.classList.add('slideInUp')
    drawingBoard.addEventListener('animationend', ()=>
    {drawingBoard.classList.remove('slideInUp')})  

    instructions.style.display = 'none'
    members.style.display = 'none'
    finalResultsDiv.style.display = 'none'
    leaveButtonsDiv.style.display = 'none'
}

function setupGamepage(){
    mainDiv.classList.remove('container')
    mainDiv.classList.add('container-fluid')
    ingameDiv.style.display = 'block'

    //createLobbyDiv.style.display = 'none'
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
    members.style.display = 'block'
    leaveButtonsDiv.style.display = 'block'
    playAgainButton.style.display = 'none'
    finalResultsDiv.style.display = 'none'
}

function setupWordList(){
    wordDiv.style.display = 'block'
}

function setupDraw(){
    leaveButtonsDiv.style.display = 'none'
    timer.style.display = 'block'
    titleDiv.style.display = 'none'
    guessDiv.style.display = 'none'
    drawingBoard.style.display = 'block'
    wordDiv.style.display = 'none'
    //drawingBoard.classList.add('slideInUp')
    //chatDiv.classList.add('slideInLeft')
    //currentLobbyDiv.classList.add('bounceInRight')
    finishDrawDiv.style.display = 'block'
}

function setupGuess(){
    finishDrawDiv.style.display = 'none'
    guessDiv.style.display = 'block'
    wordDiv.style.display = 'none'
}

function setupResults(data){
    drawingBoard.style.display = 'none'
    titleDiv.style.display = 'block'
    finalResultsDiv.style.display = 'block'
    timer.style.display = 'none'
    instructions.style.display = 'none'
    guessDiv.style.display = 'none'
    finishDrawDiv.style.display = 'none'
    makeMemberLinks(data)
    leaveButtonsDiv.style.display = 'block'
    playAgainButton.style.display = 'block'
}

function makeMemberLinks(data){
    currentLobbyBox.innerHTML = '<h3 id="lobby-members">Lobby Members:</h3>'
    console.log(data.allChainedData)
    for (let i = 0; i < data.allPlayerList.length; i++){
        let memberName = data.allPlayerList[i]
        currentLobbyBox.innerHTML += `
            <button id="memberChain${i}" type="button" class="btn btn-link">${memberName}</button>
        `
    }
    for (let i = 0; i < data.allPlayerList.length; i++){
        let memberName = data.allPlayerList[i]
        let memberChainLink = document.getElementById(`memberChain${i}`)
        let modifiedPlayerList = data.allPlayerList.slice(i, data.allPlayerList.length).concat(data.allPlayerList.slice(0, i))
        memberChainLink.addEventListener('click', ()=>{
            console.log(`View ${memberName}'s chain`)
            addCarousel(data.allChainedData[i], modifiedPlayerList)
        })
    }
    addCarousel(data.allChainedData[0], data.allPlayerList)
}


function addCarousel(chain, players){
    console.log(players)
    let theName = players[0]
    let theWord = chain[0]
    originalWord.innerText = theName +"'s starting word was: " + theWord
    for (let i = 1; i < chain.length; i++){
        if (i % 2 == 1){
            if (i == 1){
                finalResultsInner.innerHTML = `
                    <div class="carousel-item active">
                        <h3>Drawn by: ${players[i-1]}</h3>
                        <img src="${chain[i]}" width="auto" height="auto">
                        <h3>${players[i]} guessed ${chain[i+1]}</h3>
                    </div>
                `
            }
            else if (i < chain.length - 1){
                finalResultsInner.innerHTML += `
                    <div class="carousel-item">
                        <h3>Drawn by: ${players[i-1]}</h3>
                        <img src="${chain[i]}" width="auto" height="auto">
                        <h3>${players[i]} guessed ${chain[i+1]}</h3>
                    </div>
                `
            }
            else{
                finalResultsInner.innerHTML += `
                    <div class="carousel-item">
                        <h3>Drawn by: ${players[i-1]}</h3>
                        <img src="${chain[i]}" width="auto" height="auto">
                        <h3 style="visibility:hidden"> WHASLJSAKAJDKLASJdlkJ </h3>
                    </div>
                `
            }
        }    
        
    }
    
}