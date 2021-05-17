var express = require('express');
var router = express.Router();

let lobby_controller = require('../controllers/lobbyController');

/**
 * Sets the route of '/lobby' to the controller 'room_list' from lobbyController 
*/
router.get('/', lobby_controller.lobby, lobby_controller.room_list);

module.exports = router;
