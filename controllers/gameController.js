let Image = require("../models/imageModel");


/**
 * Controller that is being used when accessing the game view
 */
exports.game = function(req, res) {
    res.render('game', {title: 'game'});
}

/**
 * Controller that is being used when accessing the guesser view
 */
exports.game_guesser = function(req, res) {
    res.render('guesser', {title: 'guesser'});
};

/**
 * Controller that is being used when accessing the helper view
 */
exports.game_helper = function (req, res, next) {
    let random_index = Math.round(Math.random() * 12);
    console.log(random_index);
  
    Image.find({})
      .skip(random_index)
      .limit(1)
      .exec(function (err, list_image) {
        if (err) {
          return next(err);
        }
  
        //Successful, so render
        res.render("helper", {
          title: "Helper",
          image_list: list_image,
        });
      });
  };