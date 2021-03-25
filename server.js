// The back-end

// Initialize app as a function handler to supply to an HTTP server
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// // Will check if we have an env var named port and use that, otherwise it will run on 3000
// const PORT = 3000 || process.env.PORT;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/start.html');
  });


const users = {};

io.on('connection', (socket) => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('send-chat-message', message => {
        // Sends message to everybody on the server, except the person sending it
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

// Run the server and informs us of the port
http.listen(3000, () => {
    console.log(`Listening on *:3000`)
});