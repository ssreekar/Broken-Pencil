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
        socket.to(lobbies[socket.id]).emit('user-check-name')
        socket.join(lobbyName)
        lobbies[socket.id] = lobbyName
        socket.to(lobbies[socket.id]).emit('user-joined-lobby')
        socket.to(lobbies[socket.id]).emit('user-check-name')
    })

    // Current Members
    socket.on('get-lobby-members', lobbyName=>{
        var lobbyInfo = io.sockets.adapter.rooms[lobbyName]
        if (lobbyInfo){
            var i
            var names = new Array(lobbyInfo.length);
            for (i = 0; i < lobbyInfo.length; i++){
                var theName = users[Object.keys(lobbyInfo.sockets)[i]]
                names[i] = theName
            }
            socket.emit('current-lobby-members', names)
         }
    })
    // Start Game
    user_words = {}

    socket.on('start-game', lobbyName=>{
        io.in(lobbyName).emit('game-starting')
        console.log(`Game starting in ${lobbyName}`)
    })

    socket.on('picked-word', word=>{
        user_words[socket.id] = word
        socket.emit('word-chosen')
    })

    socket.on('finished-event', (event)=>{
        if (event == 'drawing'){
            socket.emit('start-guessing')
        }
        else if (event == 'guessing'){
            socket.emit('start-drawing')
        }
        
    })
})



    
