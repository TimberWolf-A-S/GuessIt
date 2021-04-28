let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ImageSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, required: true },
});

// Virtual for image's URL
/*ImageSchema.virtual("url").get(function () {
  return `/catalog/image/${this._id}`;
});*/

// Export model
module.exports = mongoose.model("Image", ImageSchema);
