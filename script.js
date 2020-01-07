const socket = io('http://localhost:3000')
const messageForm = document.getElementById('inputStuff')
const messageInput = document.getElementById('inputOne')
const messageContainer = document.getElementById('firstDiv')

const name = prompt("What is your name?")
var lobbyName = 'global_room'
socket.emit('new-member', name)
socket.on('name-error', ()=>{
    const name = prompt("That name is taken. Please enter another name!")
    socket.emit('new-member', name)
})

appendInfo("You Joined")
changeLobby("Global Lobby")
displayCurrentMembers()

socket.on('chat-message', data=>{
    appendInfo(data.name +": " + data.message)
})

socket.on('user-connected', name=>{
    appendInfo(name + " Connected")
})

socket.on('user-disconnected', name=>{
    appendInfo(name + " Disconnected")
})

messageForm.addEventListener('submit', e =>{
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', {message, name})
    appendInfo("You: " + message)
    messageInput.value = ''
})

function appendInfo (info){
    const messageElement = document.createElement('div')
    messageElement.innerText = info
    messageContainer.append(messageElement)
}

//Lobby Constants
const lobbyForm = document.getElementById('lobbyForm')
const lobbyTextBox = document.getElementById('lobbyName')

//Handling Join Lobby Input
lobbyForm.addEventListener('submit', e=>{
    e.preventDefault()
    lobbyName = lobbyTextBox.value;
    appendInfo("You Joined Lobby")
    changeLobby(lobbyName)
    socket.emit('join-room', lobbyName)
    lobbyTextBox.value = ''
    displayCurrentMembers()
})

//User Joined Lobby
socket.on('user-joined-lobby', userName=>{
    appendInfo(userName + " Joined Lobby")
})

//Current Lobby Function
function changeLobby(lobbyName){
    document.getElementById("CurrentLobby").innerHTML = "Current Lobby: " + lobbyName    
}

//Add Lobby Member
function addMember(memberName){
    const header = document.getElementById('LobbyMembers')
    const addition = document.createElement('h5')
    addition.innerHTML = memberName
    header.append(addition)
}

// Display all Current Members
function displayCurrentMembers(){
    socket.emit('getRoomMembers', lobbyName)
}

// Getting the User Members
socket.on('currentRoomMembers', listOfNames=>{
    var i;
    clearCurrentMembers()
    for (i = 0; i < listOfNames.length; i++){
        addMember(listOfNames[i])
    }
})

//clears all the members of a lobby
function clearCurrentMembers(){
    var header = document.getElementById('LobbyMembers')
    while(!(header.childElementCount == 0)){
        header.lastChild.remove()
    }
}

// start game

function toggleLobbyStart(){
    var x = document.getElementById('lobbyStart');
    if (x.style.display === "none") {
    x.style.display = "block";
    } 
    else {
    x.style.display = "none";
    }
}

const startBtn = document.getElementById('start-button')

startBtn.addEventListener('click', ()=>{
    socket.emit('start-game', lobbyName)
    console.log('Start Requested')
})

var word
const wordBank = document.getElementById('wordBank')

socket.on('game-starting', ()=>{
    console.log('Game Start')
    appendInfo('Game is Starting!')
    toggleLobbyStart()
    if (wordBank.style.display == 'none'){
        wordBank.style.display = 'block'
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
    const instructionMessage = document.createElement('h2')
    const instructions = document.getElementById('instructions')
    if (current == 'draw'){
        instructionMessage.innerText = `Try to draw: ${word}`
        instructions.append(instructionMessage)
    }
    else{
        instructionMessage.innerText = `Guess this drawing`
        instructions.append(instructionMessage)
    }
}

socket.on('word-chosen', ()=>{
    wordBank.style.display = "none";
    displayInstruction('draw')
})


