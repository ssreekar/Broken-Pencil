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
        socket.to(lobbies[socket.id]).emit('chat-message', message)
        console.log(`${users[socket.id]} sent ${message.message} to lobby: ${lobbies[socket.id]}`)
    })

    socket.on('new-member', name=>{
        if (Object.values(users).indexOf(name) > -1) {
            socket.emit('name-error')
            socket.to(globalLobby).emit('user-list', name)
        }
        else{
            users[socket.id] = name
            socket.to(globalLobby).emit('user-connected', name)
            socket.to(globalLobby).emit('user-list', name)
            socket.to(globalLobby).emit('user-check-name', users[socket.id])
        }
    })

    socket.on('disconnect', ()=>{
        socket.to(globalLobby).emit('user-disconnected', users[socket.id])
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
        socket.to(lobbies[socket.id]).emit('user-joined-lobby', users[socket.id])
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

http.listen(port, () => {
    console.log('Listening on port: ' + port);
})



    
