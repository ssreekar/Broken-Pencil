const io = require("socket.io")(3000)

users = {}

// Lobby Id
lobbies = {}
globalLobby = 'Global'

io.on("connection", socket => {
    console.log("New User Connection")
    socket.join(globalLobby)
    lobbies[socket.id] = globalLobby

    socket.on('send-chat-message', message=>{
        socket.to(lobbies[socket.id]).emit('chat-message', message)
        console.log(`${users[socket.id]} sent ${message.message} to lobby: ${lobbies[socket.id]}`)
    })

    socket.on('new-member', name=>{
        users[socket.id] = name
        socket.to(globalLobby).emit('user-connected', name)
    })

    socket.on('new-name', name=>{
        users[socket.id] = name
    })

    socket.on('disconnect', ()=>{
        socket.to(globalLobby).emit('user-disconnected')
        socket.leaveAll()
        delete users[socket.id]
        delete lobbies[socket.id]
    })

    //Joining lobbies
    socket.on('join-lobby', lobbyName=>{
        console.log(`${users[socket.id]} Joined ${lobbyName}`)
        socket.leaveAll(lobbies[socket.id])
        socket.join(lobbyName)
        lobbies[socket.id] = lobbyName
        socket.to(lobbies[socket.id]).emit('user-joined-lobby', users[socket.id])
    })

    // Current Members
    socket.on('get-lobby-members', lobbyName=>{
        var lobbyInfo = io.sockets.adapter.rooms[lobbyName]
        if (lobbyInfo){
            var i
            var names = new Array(lobbyInfo.length);
            var userIds = Object.keys(lobbyInfo.sockets)
            for (i = 0; i < lobbyInfo.length; i++){
                if (i < lobbyInfo.length - 1){
                    userNextPlayer[userIds[i]] = userIds[i+1]
                }
                else{
                    userNextPlayer[userIds[i]] = userIds[0]
                }
                var theName = users[userIds[i]]
                names[i] = theName
            }
            io.in(lobbies[socket.id]).emit('current-lobby-members', names)
         }
    })
    // Start Game
    // We can maybe collapse these down later on...
    userNextPlayer = {} // stores key: player id, value: next player id
    userCurrentData = {} // stores key: player id, value: current drawing/guessed word
    userStatus = {} // stores key: player id, value: boolean if done task
    socket.on('start-game', lobbyName=>{
        io.in(lobbyName).emit('game-starting')
        console.log(`Game starting in ${lobbyName}`)
    })

    socket.on('picked-word', word=>{
        userCurrentData[socket.id] = word
        socket.emit('word-chosen', word)
    })

    socket.on('finished-event', (event)=>{
        if (event == 'drawing'){
            socket.emit('start-guessing')
        }
        else if (event == 'guessing'){
            socket.emit('start-drawing', userCurrentData[socket.id])
        }        
    })

    socket.on('guessed-word', (guessedWord)=>{
        var nextPlayer = userNextPlayer[socket.id]
        userCurrentData[nextPlayer] = guessedWord
        console.log(`${users[socket.id]} sent ${users[nextPlayer]} the word ${guessedWord}`)
    })
})



    
