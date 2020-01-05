const io = require("socket.io")(3000)

users = {}

// Lobby Id
rooms = {}
globalRoom = 'global_room'

io.on("connection", socket => {
    console.log("nEW User")
    socket.join(globalRoom)
    rooms[socket.id] = globalRoom

    socket.on('send-chat-message', message=>{
        socket.to(rooms[socket.id]).emit('chat-message', message)
        console.log(`${users[socket.id]} sent ${message.message} to room: ${rooms[socket.id]}`)
    })

    socket.on('new-member', name=>{
        if (Object.values(users).indexOf(name) > -1) {
            socket.emit('name-error')
            socket.to(globalRoom).emit('user-list', name)
        }
        else{
            users[socket.id] = name
            socket.to(globalRoom).emit('user-connected', name)
            socket.to(globalRoom).emit('user-list', name)
        }
    })

    socket.on('disconnect', ()=>{
        socket.to(globalRoom).emit('user-disconnected', users[socket.id])
        delete users[socket.id]
        delete rooms[socket.id]
    })

    //Joining Rooms
    socket.on('join-room', roomName=>{
        console.log(`${users[socket.id]} Joined ${roomName}`)
        socket.leave(rooms[socket.id])
        socket.join(roomName)
        rooms[socket.id] = roomName
        socket.to(rooms[socket.id]).emit('user-joined-lobby', users[socket.id])
    })

    // Current Members
    socket.on('getRoomMembers', lobby=>{
        var roomInfo = io.sockets.adapter.rooms[lobby]
        if (roomInfo){
            var i
            console.log(Object.keys(roomInfo.sockets))
            var names = new Array(roomInfo.length);
            for (i = 0; i < roomInfo.length; i++){
                var theName = users[Object.keys(roomInfo.sockets)[i]]
                names[i] = theName
                console.log(theName)
            }
            socket.emit('currentRoomMembers', names)
         }
    })

    // Current Members
    socket.on('getRoomMembers', lobby=>{
        var roomInfo = io.sockets.adapter.rooms[lobby]
        if (roomInfo){
            var i
            console.log(Object.keys(roomInfo.sockets))
            var names = new Array(roomInfo.length);
            for (i = 0; i < roomInfo.length; i++){
                var theName = users[Object.keys(roomInfo.sockets)[i]]
                names[i] = theName
                console.log(theName)
            }
            socket.emit('currentRoomMembers', names)
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
})



    
