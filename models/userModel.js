let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Creates new user Schema and defining the fields
 */
let UserSchema = new Schema({
  username: { type: String, required: true },
  room: { type: String, required: true },
  score: { type: Number },
  role: { type: String, required: true },
});

// Export model
module.exports = mongoose.model('User', UserSchema);
