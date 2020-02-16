const io = require("socket.io")(3000)

users = {}

// Lobby Id
lobbies = {}
globalLobby = 'Global'
lobbies[globalLobby] = []
readyInformation = {}
readyNumber = {}


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
                // Also remove ready information about person
                let userReadied = 0
                if (readyInformation[key] != null) {
                    if (readyInformation[key][socket.id] != null && 
                        readyInformation[key][socket.id]) {
                        userReadied = 1
                    }
                    delete readyInformation[key][socket.id]
                    
                }
                if (readyNumber[key] != null) {
                    if (userReadied) {
                        readyNumber[key]--  
                    }
                    console.log("New count for " + key + " is " + readyNumber[key])
                }
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
        userStatus[socket.id] = false
        socket.leave(data.lobbyName)
        // Deleting infomation in lobbies and readyInformation for old lobby
        userIndex = lobbies[data.lobbyName].indexOf(socket.id)
        if (userIndex >= 0) {
            lobbies[data.lobbyName].splice(userIndex, 1)
        } 

        socket.join(data.newLobbyName)
        socket.to(data.newLobbyName).emit('user-joined-lobby', users[socket.id])
        if (!(data.newLobbyName in lobbies)){
            lobbies[data.newLobbyName] = []
        }
        lobbies[data.newLobbyName].push(socket.id)
        if (readyInformation[data.newLobbyName] == null) {
            readyInformation[data.newLobbyName] = {}
            readyInformation[data.newLobbyName][socket.id] = false
            readyNumber[data.newLobbyName] = 0
            console.log("Initialized information about " + data.newLobbyName)
        } else {
            readyInformation[data.newLobbyName][socket.id] = false
        }
        
    })

    // Current Members
    socket.on('get-lobby-members', lobbyName=>{
        //var lobbyInfo = io.sockets.adapter.rooms[lobbyName]
        var names = []
        let number = 0
        //var userIds = Object.keys(lobbyInfo.sockets)
        if (lobbies[lobbyName] != null) {
            number = lobbies[lobbyName].length
        }
        for (var i = 0; i < number ; i++){
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


    socket.on('get-numbers', name=>{
        returnObj = {readied: readyNumber[name], members: lobbies[name].length}
        socket.emit('get-number-return', returnObj)

    })


    // Start Game
    // We can maybe collapse these down later on...
    userNextPlayer = {} // stores key: player id, value: next player id
    userCurrentData = {} // stores key: player id, value: current drawing/guessed word
    userPreviousData = {} // stores key: player id, value: previous drawing/guessed word
    userStatus = {} // stores key: player id, value: boolean if done task
    socket.on('start-game', lobbyName=>{
        io.in(lobbyName).emit('game-starting')
        console.log(`Game starting in ${lobbyName}`)
        
    })

    socket.on('picked-word', word=>{
        userCurrentData[socket.id] = word
        //socket.emit('word-chosen', word)
    })


    socket.on('finished-event', data=>{
        console.log(`${users[socket.id]} finished ${data.event}`)
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
            else if (data.event == 'guessing' || data.event == 'picking-word'){
                nextEvent = 'start-drawing'
                let number = 0
                if (lobbies[data.lobbyName] != null) {
                    number = lobbies[data.lobbyName].length
                }
                for (var i = 0; i < number; i++){
                    let currId  = lobbies[data.lobbyName][i]
                    let oldWord = userCurrentData[currId]
                    let nextPlayer = userNextPlayer[currId]
                    let nextNextPlayer = userNextPlayer[nextPlayer]
                    userPreviousData[nextNextPlayer] = oldWord
                }
            }
            console.log(`Everyone is ${nextEvent}`)        
            for (var userId of lobbies[data.lobbyName]){
                let senderObj = {reciever: userId, eventName: nextEvent, curWord: userCurrentData[userId]}
                io.in(data.lobbyName).emit('next-match', senderObj)
                userStatus[userId] = false
            }
        }
        
    })

    socket.on('ready-up', (sender)=> {
        console.log("Player Attempting to Ready")
        if (readyInformation[sender.lobby][sender.userId] == null || 
            !readyInformation[sender.lobby][sender.userId]) {
            readyInformation[sender.lobby][sender.userId] = true
            readyNumber[sender.lobby]++
            io.in(sender.lobby).emit('someone-readied')
        }
    })

    /*
    socket.on('ready-down', (sender)=> {
        console.log("Player Attempting to Unready")
        if (readyInformation[sender.lobby][sender.userId] == null ||
            !readyInformation[sender.lobby][sender.userId]) {
                console.log("Warning: Code should not be going here")
                console.log("Server is attempting to unready a player that isn't ready")
        }
        else {
            readyInformation[sender.lobby][sender.userId] = false
            readyNumber[sender.lobby]--
            io.in(sender.lobby).emit('someone-readied')   
        }
    })
*/

    // Determines if a given lobby should start
    socket.on('should-start', (lobbyName)=> {
        console.log("Determining if " + lobbyName + " should start")
        if (readyInformation[lobbyName] != null && readyNumber[lobbyName] != null) {
            if (readyNumber[lobbyName] == lobbies[lobbyName].length) {
                socket.emit('should-start-return', true)
            } else {
                socket.emit('should-start-return', false)
            }
        }
    })

    socket.on('guessed-word', (guessedWord)=>{
        var nextPlayer = userNextPlayer[socket.id]
        userCurrentData[nextPlayer] = guessedWord
        console.log(`${users[socket.id]} sent ${users[nextPlayer]} the word ${guessedWord}`)
        socket.emit('sent-info', 'guessing')
    })

    socket.on('send-drawing', drawing=> {
        console.log(drawing)
        var nextPlayer = userNextPlayer[socket.id]
        userCurrentData[nextPlayer] = drawing
        socket.emit('sent-info', 'drawing')
    })

    socket.on('get-prev-data', userId =>{
        console.log("Attempting to get previous data " + userPreviousData[userId])
        socket.emit('prev-data-return', userPreviousData[userId])
    })
})



    
