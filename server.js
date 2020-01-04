const io = require("socket.io")(3000)

users = {}

io.on("connection", socket => {
    console.log("nEW User")
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', message)
        console.log(message.message)
    })
    //edit start
    socket.on('new-member', name=>{
        if (Object.values(users).indexOf(name) > -1) {
            socket.emit('name-error')
            socket.broadcast.emit('user-list', users)
        }
        else{
            users[socket.id] = name
            socket.broadcast.emit('user-connected', name)
            socket.broadcast.emit('user-list', users)
        }
        
    })
    //edit end

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

