const socket = io('http://localhost:3000')
const messageForm = document.getElementById('inputStuff')
const messageInput = document.getElementById('inputOne')
const messageContainer = document.getElementById('firstDiv')

const name = prompt("What is your name?")
appendInfo("You Joined")
socket.emit('new-member', name)

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
    console.log(lobbyName)
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
    var i
    clearCurrentMembers()
    for (i = 0; i < listOfNames.length; i++){
        addMember(listOfNames[i])
        console.log(listOfNames[i])
    }
})

//clears all the members of a lobby
function clearCurrentMembers(){
    
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

socket.on('game-starting', ()=>{
    console.log('Game Started')
    appendInfo('Game is Starting!')
    toggleLobbyStart()
})

