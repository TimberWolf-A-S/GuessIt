var express = require('express');
var router = express.Router();

let help_controller = require('../controllers/helpController');
let settings_controller = require('../controllers/settingsController');

 /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Get help. */
router.get('/help', help_controller.help_site); 

/* Get settings */
router.get('/settings', settings_controller.settings_site);

module.exports = router;