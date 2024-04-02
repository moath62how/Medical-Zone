const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  answers: {
    type: [String],
    required: true,
  },
  c_answer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  sub_question: {
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
