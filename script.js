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