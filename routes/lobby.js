var express = require('express');
var router = express.Router();

let lobby_controller = require('../controllers/lobbyController');

router.get('/', lobby_controller.lobby);

module.exports = router;
