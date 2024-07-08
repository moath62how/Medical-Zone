const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "A questions Must have an text"],
  },
  type: {
    type: String,
    enum: ["MCQ", "MEQ"],
    required: true,
  },
  tags: {
    type: [String],
  },
  answers: {
    type: [String],
  },
  c_answer: {
    type: [String],
    required: [true, "A questions Must have an correct Answer"],
  },
  explanation: {
    type: String,
  },
  sub_question: {
    type: [String],
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
