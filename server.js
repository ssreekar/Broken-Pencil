const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

let users = {};

// Lobby Id
let rooms = {};
let globalRoom = 'global_room';

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log("new user")
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
            socket.to(globalRoom).emit('user-check-name', users[socket.id])
        }
    })

    socket.on('disconnect', ()=>{
        socket.to(globalRoom).emit('user-disconnected', users[socket.id])
        socket.leaveAll()
        delete users[socket.id]
        delete rooms[socket.id]
    })

    //Joining Rooms
    socket.on('join-room', roomName=>{
        console.log(`${users[socket.id]} Joined ${roomName}`)
        socket.leaveAll(rooms[socket.id])
        socket.to(rooms[socket.id]).emit('user-check-name')
        socket.join(roomName)
        rooms[socket.id] = roomName
        socket.to(rooms[socket.id]).emit('user-joined-lobby', users[socket.id])
        socket.to(rooms[socket.id]).emit('user-check-name')
    })

    // Current Members
    socket.on('getRoomMembers', lobby=>{
        var roomInfo = io.sockets.adapter.rooms[lobby]
        if (roomInfo){
            var i
            var names = new Array(roomInfo.length);
            for (i = 0; i < roomInfo.length; i++){
                var theName = users[Object.keys(roomInfo.sockets)[i]]
                names[i] = theName
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

    socket.on('finished-event', (event)=>{
        if (event == 'drawing'){
            socket.emit('start-guessing')
        }
        else if (event == 'guessing'){
            socket.emit('start-drawing')
        }
        
    })
})

http.listen(port, () => {
    console.log('Listening on port: ' + port);
})



    
