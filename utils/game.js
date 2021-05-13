let mongoose = require('mongoose');

let UserData = require('./models/userModel');
let RoomData = require('./models/roomModel');

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

module.exports = {
  startGame,
  stopGame,
  selectHelper,
};
