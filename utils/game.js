function startGame(id, users) {
	let round = 1;
	let score = 0;
	const game = {id, users, round, score};
}

function stopGame() {
	console.log("Stopped");
}

module.exports = {
  startGame,
  stopGame,
};