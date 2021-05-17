/**
 * Controller that is being used when accessing the settings view
 */
exports.settings_site = function(req, res) {
    res.render('settings', {title: 'Settings'});
};