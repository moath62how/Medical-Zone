const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Questions",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    // required: true,
  },
});

const Sets = mongoose.models("Sets", setSchema);
module.exports = Sets;
