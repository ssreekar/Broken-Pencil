$(function() {
    var socket = io();
    var messageForm = document.getElementById('inputStuff')
    var messageInput = document.getElementById('inputOne')
    var messageContainer = document.getElementById('firstDiv')

    var name = prompt("What is your name?")
    var lobbyName = 'global_room';
    socket.emit('new-member', name)
    socket.on('name-error', ()=>{
        var newName = prompt("That name is taken. Please enter another name!")
        socket.emit('new-member', newName)
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
        var message = messageInput.value
        socket.emit('send-chat-message', {message, name})
        appendInfo("You: " + message)
        messageInput.value = ''
    })

    function appendInfo (info){
        var messageElement = document.createElement('div')
        messageElement.innerText = info
        messageContainer.append(messageElement)
    }

    //Lobby varants
    var lobbyForm = document.getElementById('lobbyForm')
    var lobbyTextBox = document.getElementById('lobbyName')

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

    socket.on('user-check-name', ()=>{
        displayCurrentMembers()
    })

    //Current Lobby Function
    function changeLobby(lobbyName){
        document.getElementById("CurrentLobby").innerHTML = "Current Lobby: " + lobbyName    
    }

    //Add Lobby Member
    function addMember(memberName){
        var header = document.getElementById('LobbyMembers')
        var addition = document.createElement('h5')
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

    var startBtn = document.getElementById('start-button')

    startBtn.addEventListener('click', ()=>{
        socket.emit('start-game', lobbyName)
        console.log('Start Requested')
    })

    // Word Selection
    var word
    var wordBank = document.getElementById('wordBank')

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


    var instructions = document.getElementById('instructions')
    var instructionMessage
    function displayInstruction(current, deletePrevious){
        if (deletePrevious == true){
            instructionMessage = document.getElementById('instructionMessage')
            instructionMessage.parentNode.removeChild(instructionMessage)
        }
        else{
            instructionMessage = document.createElement('h2')
            instructionMessage.setAttribute('id', 'instructionMessage')
        }
        if (current == 'draw'){
            instructionMessage.innerText = `Try to draw: ${word}`
            instructions.append(instructionMessage)
        }
        else{
            instructionMessage.innerText = `Guess this drawing!`
            instructions.append(instructionMessage)
        }
    }

    // Draw Timer

    function finishedEvent(event){
        console.log(`Done ${event}`)
        timerText.parentNode.removeChild(timerText)
        if (event == 'drawing'){
            finishButton.parentNode.removeChild(finishButton)
        }
        else if (event == 'guessing'){
            guessForm.parentNode.removeChild(guessForm)
        }
        
        clearInterval(countdown)
        socket.emit('finished-event', event)
    }

    var timer = document.getElementById('timer')
    var timerText
    var countdown
    function startTimer(start, event){
        var timeLeft = start
        timerText = document.createElement('h3')
        timerText.innerText = `Time Remaining: ${timeLeft}`
        timer.append(timerText)
        countdown = setInterval(()=>{
            timeLeft -= 1
            timerText.innerText = `Time Remaining: ${timeLeft}`
            timerText.parentNode.removeChild(timerText);
            timer.append(timerText)
            if (timeLeft <= 0){
                finishedEvent(event)
            }
        }, 1000)
    }

    var finishButton
    function createFinishButton(){
        var finish = document.getElementById('finish')
        finishButton = document.createElement('button')
        finishButton.setAttribute('id', 'finishButton')
        finishButton.innerText = 'Done!'
        finish.append(finishButton)
        finishButton.addEventListener('click', ()=>{
            finishedEvent('drawing')
        })
    }

    socket.on('word-chosen', ()=>{
        wordBank.style.display = "none";
        displayInstruction('draw', false)
        createFinishButton()
        startTimer(30, 'drawing')
    })

    socket.on('start-drawing', ()=>{
        displayInstruction('draw', true)
        createFinishButton()
        startTimer(30, 'drawing')
    })

    // Guess drawing
    var guessedWord
    var guessForm = document.createElement('form')
    var guessTextBox = document.createElement('input') 
    var guessDiv = document.getElementById('guessDiv')
    var submitGuess = document.createElement('button')
    function createGuessForm(){
        guessForm.setAttribute('id', 'guessWord')
        guessTextBox.setAttribute('type', 'text')
        submitGuess.setAttribute('type', 'submit')
        submitGuess.innerText = 'Enter'

        guessDiv.append(guessForm)
        guessForm.append(guessTextBox)
        guessForm.append(submitGuess)

        startTimer(15, 'guessing')
        
    }

    guessForm.addEventListener('submit', e=>{
        e.preventDefault()
        guessedWord = guessTextBox.value;
        console.log(`You guessed: ${guessedWord}`)
        guessTextBox.value = ''
        finishedEvent('guessing')
    })

    socket.on('start-guessing', ()=>{
        console.log('Start Guessing!')
        displayInstruction('guess', true)
        createGuessForm()
    })
});