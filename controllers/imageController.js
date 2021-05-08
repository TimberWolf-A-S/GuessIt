// let Image = require("../models/image");

// // Display list of all images
// exports.image_list = function (req, res, next) {
//   random_index = Math.floor(Math.random() * 12);

//   Image.find({})
//     .limit(-1)
//     .skip(random_index)
//     .exec(function (err, list_image) {
//       if (err) {
//         return next(err);
//       }

//       //Successful, so render
//       res.render("image_list", {
//         title: "Image List",
//         image_list: list_image,
//       });
//     });
// };