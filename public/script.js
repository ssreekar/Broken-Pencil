const socket = io('http://localhost:3000')
setupHomepage()

var name = 'Guest'
var password = ''
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
    displayReadyMembers()
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
    socket.emit('check-lobby-exist', {lobbyName: lobbyInput.value, action: 'join'})
})

socket.on('lobby-no-exist', (data)=>{
    console.log(`Lobby does not exist. Action: ${data.action}`)
    if (data.action == 'create'){
        //native javascript version not working
        //createLobbyModal.hide()
        $('#create-lobby-modal').modal('hide')
        console.log(`Created new lobby: ${data.lobbyName}`)
        if (password.length > 0){
            socket.emit('set-lobby-password', {lobbyName: data.lobbyName, password})
        }
        joinLobby(data.lobbyName)
    } else{
        lobbyInput.classList.add('is-invalid')
    }
})

socket.on('lobby-exists', (data)=>{
    if (data.action == 'join'){
        if (data.passwordProtected){
            //native javascript version not working
            //passwordModal.show()
            $('#password-modal').modal('show')
        } else{
            console.log(`Joined existing lobby: ${data.lobbyName}`)
            joinLobby(data.lobbyName)
        }
    } else{
        newLobbyInput.classList.add('is-invalid')
    }
})

enterPasswordForm.addEventListener('submit', e=>{
    e.preventDefault()
    password = enterPasswordInput.value
    socket.emit('enter-password', {lobbyName: lobbyInput.value, password})
})

socket.on('password-correct', ()=>{
    //native javascript version not working
    //passwordModal.hide()
    $('#password-modal').modal('hide')
    joinLobby(lobbyInput.value)
})

socket.on('password-incorrect', ()=>{
    enterPasswordInput.classList.add('is-invalid')
})

createLobbyForm.addEventListener('submit', e=>{
    e.preventDefault()
    password = lobbyPasswordInput.value
    socket.emit('check-lobby-exist', {lobbyName: newLobbyInput.value, action: 'create'})    
})

//User Joined Lobby
function joinLobby(lName){
    chatMsg.innerHTML = ''
    var newLobbyName = lName
    isReady = false
    socket.emit('join-lobby', {lobbyName, newLobbyName, password})
    lobbyInput.value = ''
    newLobbyInput.value = ''
    lobbyName = newLobbyName;
    appendInfo(`You Joined ${lobbyName}`)
    changeLobby(lobbyName)
    setupGamepage()
    displayInstruction('startGame')
    displayReadyMembers()
    displayCurrentMembers()
    createWordButtons()
    setWordButtonListener()
}

socket.on('user-joined-lobby', (name)=>{
    displayReadyMembers()
    appendInfo(name + ' Joined Lobby')
})

// User Leave Lobby
leaveLobbyButton.addEventListener('click', ()=>{
    socket.emit('leave-lobby', lobbyName)
    setupHomepage()
    lobbyName = 'Global'
    chatMsg.innerHTML = ''
    appendInfo('You Joined the Broken Pencil chat!')
})

//Current Lobby Function
function changeLobby(lobbyName){
    lobbyMembers.innerHTML = 'Members of: ' + lobbyName    
}

//Add Lobby Member
function addMember(memberName){
    const addition = document.createElement('h5')
    addition.innerHTML = memberName
    currentLobbyBox.append(addition)
}

// Display all Current Members
function displayCurrentMembers(){
    socket.emit('get-lobby-members', lobbyName)
}

// Getting the User Members
socket.on('current-lobby-members', listOfNames=>{
    var i;
    currentLobbyBox.innerHTML = `<h3 id="lobby-members">Lobby Members:</h3>`
    for (i = 0; i < listOfNames.length; i++){
        addMember(listOfNames[i])
    }
})

//Someone readied
socket.on('someone-readied', ()=>{
    displayReadyMembers()
})

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
    changeBound()
    oldHeight = oCanvas.height
    oldWidth = oCanvas.width
    redraw();

    //setupWordBank()
})

function displayInstruction(current){
    if (current == 'draw'){
        instructionMessage.innerText = `Try to draw: ${word}`
    }
    else if (current == 'guess'){
        instructionMessage.innerText = `Guess this drawing!`
    }
    else if (current == 'startGame'){
        instructionMessage.innerText = 'Choose a word to start:'
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


// The reason i have the sent-info function to call 
// finishedEvent, instead of just doing it before
// is because I need to wait for the information 
// to be sent before i call continue the next event (otherwise the code info won't be 
// stored and the next player won't know what to draw) As JS is asyncronous
socket.on('sent-info', (event)=> {
    finishedEvent(event)
})

finishButton.addEventListener('click', ()=>{
    socket.emit('send-drawing', getBaseImg())
})

function startTimer(start, event){
    let timeLeft = start
    timerText.innerText = `Time Remaining: ${timeLeft}`
    countdown = setInterval(()=>{
        if (timeLeft > 0){
            timeLeft -= 1
            timerText.innerText = `Time Remaining: ${timeLeft}`
            if (timeLeft == 0){
                if (event == 'drawing') {
                    socket.emit('send-drawing', getBaseImg())
                } else if (event == 'guessing'){
                    guessTextBox.value = ''
                    sendPersonBehind()
                }
            }
        }
        
    }, 1000)
}

function sendPersonBehind() {
    socket.emit('getsend-prev-data', personalId)
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
    turnOffDisplay()
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
    displayPicture(newDrawing)
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

// Game Results

socket.on('game-finished', data=>{
    console.log('Game has finished!')
    clearInterval(countdown)
    setupResults(data)
})