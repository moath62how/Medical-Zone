const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
    required: true,
  },
  description: {
    type: String,
    default: "Has a lot of Questions that will bes helpful to you.",
  },
  img: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

const Sets = mongoose.model("Sets", setSchema);
module.exports = Sets;
