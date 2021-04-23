let Image = require("../models/image");

exports.game = function(req, res) {
    res.render('game', {title: 'game'});
}

exports.game_guesser = function(req, res) {
    res.render('guesser', {title: 'guesser'});
};

exports.game_helper = function (req, res, next) {
    random_index = Math.floor(Math.random() * 12);
  
    Image.find({})
      .limit(-1)
      .skip(random_index)
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