var express = require('express');
var router = express.Router();

let game_controller = require('../controllers/gameController');

router.get('/', game_controller.game);

router.get('/guesser', game_controller.game_guesser);

router.get('/helper', game_controller.game_helper);

module.exports = router;