var express = require('express');
var router = express.Router();

let lobby_controller = require('../controllers/lobbyController');
let GameData = require('../models/roomModel');

router.get('/', lobby_controller.lobby, lobby_controller.room_list);

router.get('/', function (req, res, next) {
  GameData.find().then(function (doc) {
    res.render('lobby', { items: doc });
    console.log('DOC', doc);
  });
});

module.exports = router;
