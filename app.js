/**
 * Requiring Middleware
 */
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let socketIo = require('socket.io');

module.exports = function (app, server) {
  const formatMessage = require('./utils/messages');
  const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    DisaggregateUserAndRoom,
  } = require('./utils/users');

  let indexRouter = require('./routes/index');
  let gameRouter = require('./routes/game');
  let lobbyRouter = require('./routes/lobby');

  let UserData = require('./models/userModel');
  let RoomData = require('./models/roomModel');
  let ImageData = require('./models/imageModel');

  /**
   * Set up mongoose connection
   */
  
  let mongoose = require('mongoose');
  const dev_db_url = require('./MongoDB/connection');
  let mongoDB = process.env.MONGODB_URI || dev_db_url;
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  /**
   * View engine setup
   */
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  /**
   * Connecting to the socket server
   */
  let io = socketIo(server, { transports: ['websocket', 'polling'] });
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/game', gameRouter);
  app.use('/lobby', lobbyRouter);

  /**
   * Catch 404 and forward to error handler
   */
  app.use(function (req, res, next) {
    next(createError(404));
  });

  /**
   * Error handler
   */
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  const botName = 'GuessIt';
  let countdownGoing = false;

  /**
   * Run when a client connects
   */
  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room, score }) => {
      const user = userJoin(socket.id, username, room, score);

      // Created user in backend
      let userForm = {
        username: username,
        room: room,
        score: 0,
        // Set role as helper by default
        role: 'Helper',
      };

      // Fill model for user
      let data = UserData(userForm);
      // save in database
      data
        .save()
        .then(() => {
          // Create Instance of User frontend
          UserData.find({ username: user.username })
            .exec()
            .then((docs) => {
              const userDocument = docs[0];
              //Find room
              RoomData.find({ name: room })
                .exec()
                .then((r) => {
                  const roomId = r[0]._id;
                  const userId = userDocument.id;
                  // Add user to currentMembers array in room
                  RoomData.updateOne({ _id: roomId }, { $push: { currentMembers: [userId] } }).exec();
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      // Subscribe socket to room
      socket.join(user.room);

      // Welcome Message to new user
      socket.emit('message', formatMessage(botName, `Welcome to GuessIt ${username}`));

      // Broadcast when a user connect to everybody already connected in room
      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

      // Choose random image in backend
      socket.on('helperImageSelector', function () {
        RoomData.find({ name: user.room })
          .exec()
          .then((r) => {
            const roomId = r[0].id;

            ImageData.find({})
              .exec()
              .then((i) => {
                // Get number of images from database
                const numberOfImages = i.length - 1;
                // Generate random number
                const randomImage = Math.round(Math.random(numberOfImages) * numberOfImages);
                // Number used to decide which image index is being used
                const randomImageDocument = i[randomImage];

                // Updates room with the chosen random image name and url
                RoomData.updateOne(
                  { _id: roomId },
                  { hint: randomImageDocument.name, image: randomImageDocument.image }
                ).exec();
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });

      // Timer
      let counter = 120;
      // Starts as soon as there is two socket connections
      if ((getRoomUsers(user.room)).length >= 2 &&  countdownGoing != true) {
        countdownGoing = true;
        // Set interval for countdown to one second
        let countdown = setInterval(function () {
          // FIX emitting to all rooms
          io.sockets.emit('counter', counter);
          counter--;
          if (counter === 0) {
            io.sockets.emit('counter', 'TIME IS UP!!');
            countdownGoing = false;
            clearInterval(countdown);
          }
        }, 1000);
      }

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      // Listen for correct answer and updates scoreboard
      socket.on('correct', (msg) => {
        const user = getCurrentUser(socket.id);
        // Points will only be given if the answer has arrived before the timer runs out
        if (countdownGoing == true) {
          io.to(user.room).emit('message', formatMessage(botName, msg));
          io.to(user.room).emit('updateScoreboard', user);
        }
      });
    });

    // Listen for chatMesssage and show to all users in room
    socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      // Finds and deletes the user from DB when leaving game
      DisaggregateUserAndRoom(user.username, user.room);
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  });
};
