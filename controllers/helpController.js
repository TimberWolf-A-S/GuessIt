/**
 * Controller that is being used when accessing the help view
 */
exports.help_site = function(req, res) {
    res.render('help', {title: 'Help'});
};