const io = require("socket.io")(3000)

users = {}

io.on("connection", socket => {
    console.log("nEW User")
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', message)
        console.log(message.message)
    })
    socket.on('new-member', name=>{
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

