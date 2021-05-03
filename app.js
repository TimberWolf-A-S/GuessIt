var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketIo = require('socket.io');

module.exports = function(app, server) {
  const formatMessage = require("./utils/messages");
  const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
  } = require("./utils/users");

  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var gameRouter = require('./routes/game');
  var lobbyRouter = require('./routes/lobby');

  //Set up mongoose connection
  let mongoose = require("mongoose");
  let dev_db_url = `mongodb+srv://Timberwolves:Timberwolves123@cluster0.3ilbb.mongodb.net/GuessIt?retryWrites=true&w=majority`;
  let mongoDB = process.env.MONGODB_URI || dev_db_url;
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  let io = socketIo(server, { transports: ['websocket', 'polling'] });
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/game', gameRouter);
  app.use('/lobby', lobbyRouter);



  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  const botName = "ChatCord Bot";
  let clients;
  //Run when a client connects
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);

      clients = +socket.adapter.sids.size;
      // let userArray = [];
      io.in(user.room).emit('connectedUser', `clients: ${clients} in room ${room}`);
      console.log(`clients: ${clients} in room ${room}`);
      
      socket.emit("message", formatMessage(botName, `Welcome to GuessIt ${username}`));

      // Broadcast when a user connect
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has joined the chat`)
        );

        //// TIMER////////
      var counter = 60;
        if (clients == 4) {
          var Countdown = setInterval(function(){
          io.sockets.emit('counter', counter);
          counter--
          if (counter === 0) {
            io.sockets.emit('counter', "TIME IS UP!!");
            clearInterval(Countdown);
          }
        }, 1000);
        }

      ///////////



      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      io.to(user.room).emit("startButton", getRoomUsers(user.room));

      socket.on("correct", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
      })

    // socket.emit("redirectToNewGame",(getRoomUsers(user.room), '/game/helper'));
    });







    // Listen for chatMesssage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit("message", formatMessage(user.username, msg));

    });

    // Listen for correct answer
    // socket.on('correct', (message) => {
    //   const user = getCurrentUser(socket.id);

    // });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
}