let mongoose = require("mongoose");
let Schema = mongoose.Schema;

/**
 * Creates new image Schema and defining the fields
 */
let ImageSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number },
  image: { type: String, required: true },
});
// Export model
module.exports = mongoose.model("Image", ImageSchema);
