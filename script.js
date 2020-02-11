const socket = io('http://localhost:3000')
setupHomepage()

var name = 'Guest'
socket.emit('new-member', name)
changeLobby('Global')
appendInfo('You Joined')

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

socket.on('user-disconnected', ()=>{
    appendInfo(name + ' Disconnected')
})

chatForm.addEventListener('submit', e =>{
    e.preventDefault()
    const message = chatInput.value
    socket.emit('send-chat-message', {message, name})
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
    lobbyName = lobbyInput.value;
    appendInfo('You Joined Lobby')
    changeLobby(lobbyName)
    socket.emit('join-lobby', lobbyName)
    lobbyInput.value = ''
    setupGamepage()
    displayCurrentMembers()
})

//User Joined Lobby
socket.on('user-joined-lobby', ()=>{
    appendInfo(name + ' Joined Lobby')
})

//Current Lobby Function
function changeLobby(lobbyName){
    currentLobby.innerHTML = 'Current Lobby: ' + lobbyName    
}

//Add Lobby Member
function addMember(memberName){
    const addition = document.createElement('h5')
    addition.innerHTML = memberName
    header.append(addition)
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
    while(!(header.childElementCount == 0)){
        header.lastChild.remove()
    }
}


// start game

startForm.addEventListener('click', ()=>{
    socket.emit('start-game', lobbyName)
    setupWordBank()
    console.log('Start Requested')
})

// Word Selection


socket.on('game-starting', ()=>{
    console.log('Game Start')
    appendInfo('Game is Starting!')
    if (wordDiv.style.display == 'none'){
        wordDiv.style.display = 'block'
    }
    generateWords()
    var easyBtn = document.getElementById('easy-btn')
    easyBtn.addEventListener('click', ()=>{
        word = easyBtn.value
        console.log(`You picked: ${word}`)
        socket.emit('picked-word', word)
    })
    var mediumBtn = document.getElementById('medium-btn')
    mediumBtn.addEventListener('click', ()=>{
        word = mediumBtn.value
        console.log(`You picked: ${word}`)
        socket.emit('picked-word', word)
    })
    var hardBtn = document.getElementById('hard-btn')
    hardBtn.addEventListener('click', ()=>{
        word = hardBtn.value
        console.log(`You picked: ${word}`)
        socket.emit('picked-word', word)
    })
    var veryHardBtn = document.getElementById('veryHard-btn')
    veryHardBtn.addEventListener('click', ()=>{
        word = veryHardBtn.value
        console.log(`You picked: ${word}`)
        socket.emit('picked-word', word)
    })
})

function displayInstruction(current){
    if (current == 'draw'){
        instructionMessage.innerText = `Try to draw: ${word}`
    }
    else{
        instructionMessage.innerText = `Guess this drawing!`
    }
}

// Draw Timer
function finishedEvent(event){
    console.log(`Done ${event}`)
    clearInterval(countdown)
    socket.emit('finished-event', event)
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

socket.on('word-chosen', ()=>{
    wordDiv.style.display = 'none';
    displayInstruction('draw')
    setupDraw()
    startTimer(60, 'drawing')
})

socket.on('start-drawing', ()=>{
    displayInstruction('draw')
    setupDraw()
    startTimer(60, 'drawing')
})

// Guess drawing

socket.on('start-guessing', ()=>{
    console.log('Start Guessing!')
    displayInstruction('guess')
    setupGuess()
})

// Saved Image from Drawing is in draw.js
// Save Button Function is in init function