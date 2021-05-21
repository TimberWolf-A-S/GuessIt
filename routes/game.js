/**
 * Requires express and uses it to
 * create a router object 
*/
const express = require('express');
const router = express.Router();

/**
 * Require the controllers from gameController 
 */
let game_controller = require('../controllers/gameController');

/**
 * Sets the route of '/game' to the controller 'game' from gameController 
 */
router.get('/', game_controller.game);

/**
 * Sets the route of 'game/guesser' to the controller 'game_guesser' from gameController 
 */
router.get('/guesser', game_controller.game_guesser);

/**
 * Sets the route of 'game/helper' to the controller 'game_helper' from gameController 
 */
router.get('/helper', game_controller.game_helper);

/**
 * The routes are then exported 
 */
module.exports = router;