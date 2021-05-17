let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Creates new room Schema and defining the fields
 */
let RoomSchema = new Schema({
  name: { type: String, required: true },
  currentMembers: { type: Array, required: true },
  score: { type: Array },
  image: { type: String },
  hint: { type: String },
});

// Export model
module.exports = mongoose.model('Room', RoomSchema);
