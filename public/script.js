const socket = io('http://localhost:3000')
setupHomepage()

var name = 'Guest'
let personalId = ''
let isReady = false
let gameStart = false
let numberRecieved = 0 // Debug purposes only, remove if needed
socket.emit('new-member', name)
changeLobby('Global')
appendInfo('You Joined the Broken Pencil chat!')

avatarForm.addEventListener('submit', e=>{
    e.preventDefault()
    if (avatarInput.value.length == 0){name = 'Guest'}
    else{name = avatarInput.value}
    socket.emit('new-name', name)
    avatarInput.value = ''
})

socket.on('connect', ()=>{
    console.log(socket.id);
    personalId = socket.id
});
  
socket.on('chat-message', data=>{
    appendInfo(data.name +': ' + data.message)
})

socket.on('user-connected', name=>{
    appendInfo(name + ' Connected')
})

socket.on('user-disconnected', userName=>{
    appendInfo(userName + ' Disconnected')
    displayCurrentMembers()
})

chatForm.addEventListener('submit', e =>{
    e.preventDefault()
    const message = chatInput.value
    socket.emit('send-chat-message', {message, name, lobbyName})
    appendInfo('You: ' + message)
    chatInput.value = ''
})

function appendInfo (info){
    var chatElement = document.createElement('div')
    chatElement.innerText = info
    chatMsg.prepend(chatElement)
}

//Handling Join Lobby Input
lobbyForm.addEventListener('submit', e=>{
    e.preventDefault()
    chatMsg.innerHTML = ''
    var newLobbyName = lobbyInput.value
    isReady = false
    socket.emit('join-lobby', {lobbyName, newLobbyName})
    lobbyInput.value = ''
    lobbyName = newLobbyName;
    appendInfo(`You Joined ${lobbyName}`)
    changeLobby(lobbyName)
    setupGamepage()
    displayInstruction('startGame')
    displayReadyMembers()
    displayCurrentMembers()
    createWordButtons()
    setWordButtonListener()
})

//Someone readied
socket.on('someone-readied', ()=>{
    displayReadyMembers()
})

//User Joined Lobby
socket.on('user-joined-lobby', (name)=>{
    displayReadyMembers()
    appendInfo(name + ' Joined Lobby')
})

//Current Lobby Function
function changeLobby(lobbyName){
    lobbyMembers.innerHTML = 'Members of: ' + lobbyName    
}

//Add Lobby Member
function addMember(memberName){
    const addition = document.createElement('h5')
    addition.innerHTML = memberName
    lobbyMembers.append(addition)
}

// Display all Current Members
function displayCurrentMembers(){
    socket.emit('get-lobby-members', lobbyName)
}

// Getting the User Members
socket.on('current-lobby-members', listOfNames=>{
    var i;
    clearCurrentMembers()
    for (i = 0; i < listOfNames.length; i++){
        addMember(listOfNames[i])
    }
})

//clears all the members of a lobby
function clearCurrentMembers(){
    while(!(lobbyMembers.childElementCount == 0)){
        lobbyMembers.lastChild.remove()
    }
}

//start game
function setWordButtonListener(){
    for (let i = 0; i < wordButtons.length; i++) {
        wordButtons[i].addEventListener('click', ()=>{
            /*
            if (isReady) {
                isReady = false
                socket.emit('ready-down', {userId: personalId, lobby: lobbyName})
            } else {}
                */
            isReady = true
            socket.emit('ready-up', {userId: personalId, lobby: lobbyName})
            socket.emit('should-start', lobbyName)
            socket.on('should-start-return', (data)=>{
                if (data){
                    socket.emit('start-game', lobbyName)
                }
            })
            
            displayReadyMembers()
            finishedEvent('picking-word')
        })
    }
}

// Word Selection/Game Start
socket.on('game-starting', ()=>{
    console.log('Game Start')
    turnOffReadyInfo()
    appendInfo('Game is Starting!')
    //setupWordBank()
})

function displayInstruction(current){
    if (current == 'draw'){
        instructionMessage.innerText = `Try to draw: ${word}`
    }
    else if (current == 'guess'){
        instructionMessage.innerText = `Guess this drawing!`
    }
    else if (current == 'chooseWord'){
        instructionMessage.innerText = 'Choose a word to draw:'
    }
    else if (current == 'startGame'){
        instructionMessage.innerText = 'Click start to play!'
    }
}

function displayReadyMembers() {
    if (!gameStart) {
        socket.emit('get-numbers', lobbyName)
        socket.on('get-number-return', (numbers)=>{
            console.log("reached")
            membersMessage.innerText = numbers.readied + ' players ready out of ' + numbers.members
        })
    }
}

function turnOffReadyInfo() { 
    members.style.display = 'none'
}

// Draw Timer
function finishedEvent(event){
    console.log(`Done ${event}`)
    socket.emit('finished-event', {event, lobbyName})
}

function startTimer(start, event){
    let timeLeft = start
    timerText.innerText = `Time Remaining: ${timeLeft}`
    countdown = setInterval(()=>{
        timeLeft -= 1
        timerText.innerText = `Time Remaining: ${timeLeft}`
        if (timeLeft <= 0){
            finishedEvent(event)
        }
    }, 1000)
}

socket.on('next-match', (dataObj) => {
    console.log("Next Match Event Recieved!")
    if (dataObj.reciever == personalId) {
        numberRecieved++
        console.log("Count Recieve:" + numberRecieved)
        if (dataObj.eventName == 'start-drawing') {
            draw_start(dataObj.curWord)
        } else if (dataObj.eventName == 'start-guessing') {
            draw_guess(dataObj.curWord)
        } else {
            console.log ("Warning: Error recieved in next-match event, invalid data recieved")
        }
    }
})

// The reason i put get_drawing into a function is so
// i could access it from outside the socket.on () block
// ie. the 'next-match' event
function draw_start (newWord) {
    console.log("Start Drawing!")
    word = newWord
    displayInstruction('draw')
    setupDraw()
    clearInterval(countdown)
    startTimer(60, 'drawing')    
}

// Start Drawing
socket.on('start-drawing', (newWord)=>{
    draw_start(newWord)
})

// Same logic as draw_start
function draw_guess (newDrawing) {
    console.log('Start Guessing!')
    displayInstruction('guess')
    clearInterval(countdown)
    setupGuess()
}

// Guess drawing
socket.on('start-guessing', (newDrawing)=>{
    draw_guess(newDrawing)
})

function sendGuess(guessedWord){
    socket.emit('guessed-word', guessedWord)
}

function createWordButtons(){
    generateWords()
    var easyBtn = document.getElementById('easy-btn')
    easyBtn.addEventListener('click', ()=>{
        wordBtn = easyBtn.value
        socket.emit('picked-word', wordBtn)
    })
    var mediumBtn = document.getElementById('medium-btn')
    mediumBtn.addEventListener('click', ()=>{
        wordBtn = mediumBtn.value
        socket.emit('picked-word', wordBtn)
    })
    var hardBtn = document.getElementById('hard-btn')
    hardBtn.addEventListener('click', ()=>{
        wordBtn = hardBtn.value
        socket.emit('picked-word', wordBtn)
    })
    var veryHardBtn = document.getElementById('veryHard-btn')
    veryHardBtn.addEventListener('click', ()=>{
        wordBtn = veryHardBtn.value
        socket.emit('picked-word', wordBtn)
    })
}
// Saved Image from Drawing is in draw.js
// Save Button Function is in init function