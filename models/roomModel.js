let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let RoomSchema = new Schema({
  name: { type: String, required: true },
  currentMembers: { type: Array, required: true },
  score: { type: Array },
});

// Export model
module.exports = mongoose.model("Room", RoomSchema);
