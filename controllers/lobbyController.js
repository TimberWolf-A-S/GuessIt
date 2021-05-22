let Room = require('../models/roomModel');

/**
 * Controller that is being used when accessing the lobby view
 */
exports.lobby = function (req, res, next) {
  // Finds rooms from mongoDB
  Room.find({}).exec(function (err, list_room) {
    if (err) {
      return next(err);
    }
    // Render the rooms 
    res.render('lobby', { title: 'Room List', room_list: list_room });
  });
};

/**
 * Export the room list to be used in the dropdown in the lobby view
 */
exports.room_list = function (req, res, next) {};