const io = require("socket.io")(3000)

users = {}

// Lobby Id
theRoom = 'global_room'

io.on("connection", socket => {
    console.log("nEW User")
    socket.join(theRoom)
    socket.on('send-chat-message', message=>{
        socket.to(theRoom).emit('chat-message', message)
        console.log(message.message)
    })
    //edit start
    socket.on('new-member', name=>{
        if (Object.values(users).indexOf(name) > -1) {
            socket.emit('name-error')
            socket.to(theRoom).emit('user-list', name)
        }
        else{
            users[socket.id] = name
            socket.to(theRoom).emit('user-connected', name)
            socket.to(theRoom).emit('user-list', name)
        }
        
    })
    //edit end

    socket.on('disconnect', ()=>{
        socket.to(theRoom).emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    //Joining Rooms
    socket.on('join-room', roomName=>{
        console.log("Joined Room " + roomName)
        socket.join(roomName)
        theRoom = roomName
        socket.to(theRoom).emit('user-joined-lobby', users[socket.id])
    })
    
})

