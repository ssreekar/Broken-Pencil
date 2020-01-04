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
    socket.on('new-member', name=>{
        users[socket.id] = name
        socket.to(theRoom).emit('user-connected', name)
    })
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

