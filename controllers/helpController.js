// let Help = require('../models/help');

exports.help_site = function(req, res) {
    res.render('help', {title: 'Help'});
};

// Display list of all Authors.