let express = require('express');
let router = express.Router();

let help_controller = require('../controllers/helpController');
let settings_controller = require('../controllers/settingsController');

 /**
  * Sets the route of '/' to render the index site
  */
router.get('/', function(req, res, next) {
  res.render('index');
});

/**
 * Sets the route of '/help' to the controller 'help_site' from helpController
 */
router.get('/help', help_controller.help_site); 

/**
 * Sets the route of '/settings' to the controller 'settings_site' from settingsController
 */
router.get('/settings', settings_controller.settings_site);

module.exports = router;