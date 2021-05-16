var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketIo = require('socket.io');
const { doesNotMatch } = require('assert');
const { GetAllImages } = require('./utils/game');

module.exports = function (app, server) {
  const formatMessage = require('./utils/messages');
  const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    GetUserByUserName,
    DisaggregateUserAndRoom,
    GetRoomIdByName,
  } = require('./utils/users');
  // const game = require("./utils/game");
  //const image = require("./controllers/imageController");

  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var gameRouter = require('./routes/game');
  var lobbyRouter = require('./routes/lobby');

  let UserData = require('./models/userModel');
  let RoomData = require('./models/roomModel');
  let ImageData = require('./models/image');

  //Set up mongoose connection
  let mongoose = require('mongoose');
  const dev_db_url = `mongodb+srv://Timberwolves:Timberwolves123@cluster0.3ilbb.mongodb.net/GuessIt?retryWrites=true&w=majority`;
  let mongoDB = process.env.MONGODB_URI || dev_db_url;
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  const botName = 'GuessIt';
  let clients;
  let countdownGoing = false;

  //Run when a client connects
  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room, score }) => {
      const user = userJoin(socket.id, username, room, score, 'neutral');
      // const userObj = getCurrentUser(socket.id);

      // CREATE USER IN BE
      let userForm = {
        username: username,
        room: room,
        score: 0,
        role: 'Helper',
      };

      let data = UserData(userForm);
      data
        .save()
        .then(() => {
          // Create Instance of User FE
          UserData.find({ username: user.username })
            .exec()
            .then((docs) => {
              const userdocument = docs[0];

              RoomData.find({ name: room })
                .exec()
                .then((r) => {
                  const roomid = r[0]._id;
                  const userId = userdocument.id;
                  console.log('ROOM ID: ', roomid);

                  RoomData.updateOne({ _id: roomid }, { $push: { currentMembers: [userId] } }).exec();
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

      socket.join(user.room);
      clients = socket.adapter.sids.size;

      io.in(user.room).emit('connectedUser', `clients: ${clients} in room ${room}`);
      console.log(`clients: ${clients} in room ${room}`);

      // Welcome Message to new user
      socket.emit('message', formatMessage(botName, `Welcome to GuessIt ${username}`));

      // Broadcast when a user connect
      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

      socket.on('startGame', function () {
        console.log('Button pressed');
      });

      // HELPER SELECTOR
      socket.on('helperSelector', function () {
        RoomData.find({ name: user.room })
          .exec()
          .then((r) => {
            const roomId = r[0].id;

            ImageData.find({})
              .exec()
              .then((i) => {
                const numberOfImages = i.length - 1;
                const randomImage = Math.round(Math.random(numberOfImages) * numberOfImages);
                const randomImageDocument = i[randomImage];
                console.log('Number of images', numberOfImages);
                console.log('Random', randomImage);

                RoomData.updateOne(
                  { _id: roomId },
                  { hint: randomImageDocument.name, image: randomImageDocument.image }
                ).exec();
              });

            // console.log('Random: ', Math.random(images.length()));
          });
      });

      // Timer
      let counter = 60;
      if (clients >= 2 && countdownGoing != true) {
        countdownGoing = true;
        let countdown = setInterval(function () {
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

      // io.to(user.room).emit('startButton', getRoomUsers(user.room));

      // Listen for correct answer and updates scoreboard
      socket.on('correct', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user);
        // Points will only be given if the answer has arrived before the timer runs out
        if (countdownGoing == true) {
          io.to(user.room).emit('message', formatMessage(botName, msg));
          io.to(user.room).emit('updateScoreboard', user);
        }
      });
    });

    // Listen for chatMesssage
    socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      // FINDS AND DELETES THE USER FROM DB WHEN LEAVING GAME.
      DisaggregateUserAndRoom(user.username, user.room);

      clients--;
      if (user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};
