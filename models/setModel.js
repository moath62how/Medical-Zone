const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
  },
  description: {
    type: String,
    default: "Has a lot of Questions that will bes helpful to you.",
  },
  tags: {
    type: [String],
  },
  educationalModule: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Labs", "Lectures", "Seminars"],
  },
  format: {
    type: String,
    required: true,
    enum: ["MCQ", "MEQ"],
  },
});

const Sets = mongoose.model("Sets", setSchema);
module.exports = Sets;
