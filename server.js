const io = require("socket.io")(3000)

users = {}

// Lobby Id
lobbies = {}
globalLobby = 'Global'
lobbies[globalLobby] = []

io.on("connection", socket => {
    console.log("New User Connection")
    socket.join(globalLobby)
    //lobbies[socket.id] = globalLobby
    lobbies[globalLobby].push(socket.id)

    socket.on('send-chat-message', data=>{
        socket.to(data.lobbyName).emit('chat-message', data)
        console.log(`${data.name} sent ${data.message} to lobby: ${data.lobbyName}`)
    })

    socket.on('new-member', name=>{
        users[socket.id] = name
        socket.to(globalLobby).emit('user-connected', name)
    })

    socket.on('new-name', name=>{
        users[socket.id] = name
    })

    socket.on('disconnect', ()=>{
        const lobbyKeys = Object.keys(lobbies)
        var userIndex
        // Removes user from the Lobby list
        for (var key of lobbyKeys){
            console.log(key)
            userIndex = lobbies[key].indexOf(socket.id)
            if (userIndex >= 0){
                lobbies[key].splice(userIndex, 1)
                break
            }
        }
        
        socket.to(key).emit('user-disconnected', users[socket.id])
        console.log(`${users[socket.id]} left the lobby: ${key}`)
        delete users[socket.id]
        socket.leaveAll()
    })

    //Joining lobbies
    socket.on('join-lobby', data=>{
        
        console.log(`${users[socket.id]} Joined ${data.newLobbyName}`)
        socket.leaveAll(data.lobbyName)
        socket.join(data.newLobbyName)
        socket.to(data.newLobbyName).emit('user-joined-lobby', users[socket.id])
        if (!(data.newLobbyName in lobbies)){
            lobbies[data.newLobbyName] = []
        }
        lobbies[data.newLobbyName].push(socket.id)

    })

    // Current Members
    socket.on('get-lobby-members', lobbyName=>{
        //var lobbyInfo = io.sockets.adapter.rooms[lobbyName]
        var names = []
        //var userIds = Object.keys(lobbyInfo.sockets)
        for (var i = 0; i < lobbies[lobbyName].length; i++){
            if (i < lobbies[lobbyName].length - 1){
                userNextPlayer[lobbies[lobbyName][i]] = lobbies[lobbyName][i+1]
            }
            else{
                userNextPlayer[lobbies[lobbyName][i]] = lobbies[lobbyName][0]
            }
            names.push(users[lobbies[lobbyName][i]])
        }
        io.in(lobbyName).emit('current-lobby-members', names)
         
    })
    // Start Game
    // We can maybe collapse these down later on...
    userNextPlayer = {} // stores key: player id, value: next player id
    userCurrentData = {} // stores key: player id, value: current drawing/guessed word
    userStatus = {} // stores key: player id, value: boolean if done task
    socket.on('start-game', lobbyName=>{
        io.in(lobbyName).emit('game-starting')
        console.log(`Game starting in ${lobbyName}`)
        for (var userId of lobbies[lobbyName]){
            userStatus[userId] = false
        }
    })

    socket.on('picked-word', word=>{
        userCurrentData[socket.id] = word
        socket.emit('word-chosen', word)
    })

    socket.on('finished-event', data=>{
        var everybodyDone = true
        userStatus[socket.id] = true
        for (var userId of lobbies[data.lobbyName]){
            if (userStatus[userId] == false){
                everybodyDone = false
                break
            }
        }
        if (everybodyDone){
            console.log(`Everyone is done ${data.event}`)
            var nextEvent = ''
            if (data.event == 'drawing'){
                nextEvent = 'start-guessing'
            }
            else if (data.event == 'guessing'){
                nextEvent = 'start-drawing'
                socket.emit('start-drawing', userCurrentData[socket.id])
            }        
            for (var userId of lobbies[data.lobbyName]){
                let senderObj = {reciever: userId, eventName: nextEvent, curWord: userCurrentData[userId]}
                io.in(data.lobbyName).emit('next-match', senderObj)
                //io.to(`{socket.id}`).emit(nextEvent, userCurrentData[userId])
                //This line below works fine
                //socket.emit(`${nextEvent}`, userCurrentData[userId])
                userStatus[userId] = false
            }
        }
        
    })

    socket.on('guessed-word', (guessedWord)=>{
        var nextPlayer = userNextPlayer[socket.id]
        userCurrentData[nextPlayer] = guessedWord
        console.log(`${users[socket.id]} sent ${users[nextPlayer]} the word ${guessedWord}`)
    })
})



    
