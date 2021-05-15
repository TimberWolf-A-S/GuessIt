let mongoose = require('mongoose');

let UserData = require('../models/userModel');
let RoomData = require('../models/roomModel');
let ImgData = require('../models/image');

function startGame(id, users) {
  let round = 1;
  let score = 0;
  const game = { id, users, round, score };
}

function selectHelper() {
  console.log('HELPER SELECTED');
}

function stopGame() {
  console.log('Stopped');
}

//
function GetAllImages() {
  ImgData.find({})
    .exec()
    .then((i) => {
      console.log('Images: ', i);
    });
}

module.exports = {
  startGame,
  stopGame,
  selectHelper,
  GetAllImages,
};
