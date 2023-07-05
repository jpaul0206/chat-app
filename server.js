const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set a static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatBot';

// run when client connects

io.on('connection', socket =>{
    socket.on('joinRoom',({username, room}) => {

        const user = userJoin(socket.id,username, room);

        socket.join(user.room);

        console.log("New WS connection...");
        socket.emit('message',formatMessage(botName,'Welcome to chatcord'));   // to a single client
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));                        // to everyone except the client
         
        //io.emit();                                    // to everyone

         // room and users info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });


    })


   

    
   

    // listen for chat

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });


    socket.on('disconnect',() => {

        const user = userLeave(socket.id);
        if(user){  // i.e if user exists
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));                   // when a client disconnects

            // room and users info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
})