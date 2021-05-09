var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');

let lobby_controller = require('../controllers/lobbyController');
let GameData = require('../models/roomModel');
let User = require('../models/userModel');

router.get('/', lobby_controller.lobby, lobby_controller.room_list);

router.get('/', function (req, res, next) {
  GameData.find().then(function (doc) {
    res.render('lobby', { items: doc });
    console.log('DOC', doc);
  });
});

router.post('/', function (req, res, next) {
  const user = new User({
    username: req.body.username,
    room: req.body.room,
    score: 0,
  });
  user
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
