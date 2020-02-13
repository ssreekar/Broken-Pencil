const socket = io('http://localhost:3000')
setupHomepage()

var name = 'Guest'
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
    socket.emit('join-lobby', {lobbyName, newLobbyName})
    lobbyInput.value = ''
    lobbyName = newLobbyName;
    appendInfo(`You Joined ${lobbyName}`)
    changeLobby(lobbyName)
    setupGamepage()
    displayInstruction('startGame')
    displayCurrentMembers()
})

//User Joined Lobby
socket.on('user-joined-lobby', (name)=>{
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

// start game
startForm.addEventListener('click', ()=>{
    socket.emit('start-game', lobbyName)
    console.log('Start Requested')
})

// Word Selection

socket.on('game-starting', ()=>{
    console.log('Game Start')
    appendInfo('Game is Starting!')
    setupWordBank()
    displayInstruction('chooseWord')
    if (wordDiv.style.display == 'none'){
        wordDiv.style.display = 'block'
    }
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

// Draw Timer
function finishedEvent(event){
    console.log(`Done ${event}`)
    clearInterval(countdown)
    socket.emit('finished-event', {event, lobbyName})
}

function startTimer(start, event){
    var timeLeft = start
    timerText.innerText = `Time Remaining: ${timeLeft}`
    countdown = setInterval(()=>{
        timeLeft -= 1
        timerText.innerText = `Time Remaining: ${timeLeft}`
        if (timeLeft <= 0){
            finishedEvent(event)
        }
    }, 1000)
}

socket.on('word-chosen', (newWord)=>{
    word = newWord
    wordDiv.style.display = 'none';
    displayInstruction('draw')
    setupDraw()
    startTimer(60, 'drawing')
})

socket.on('start-drawing', (newWord)=>{
    word = newWord
    displayInstruction('draw')
    setupDraw()
    startTimer(60, 'drawing')
})

// Guess drawing
socket.on('start-guessing', (newDrawing)=>{
    console.log('Start Guessing!')
    displayInstruction('guess')
    setupGuess()
})

function sendGuess(guessedWord){
    socket.emit('guessed-word', guessedWord)
}

// Saved Image from Drawing is in draw.js
// Save Button Function is in init function