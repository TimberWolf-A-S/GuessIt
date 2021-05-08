let Room = require('../models/roomModel');

exports.lobby = function (req, res) {
  //   res.render('lobby', { title: 'Lobby' });

  Room.find({}).exec(function (err, list_room) {
    if (err) {
      return next(err);
    }
    res.render('lobby', { title: 'Room List', room_list: list_room });
  });
};

exports.room_list = function (req, res, next) {};