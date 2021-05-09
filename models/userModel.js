let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
  username: { type: String, required: true },
  room: { type: String, required: true },
  score: { type: Number },
});

// Export model
module.exports = mongoose.model('User', UserSchema);
