const Question = require("../models/questionModel");
const { tryCatch } = require("../errors/catchAsync");
const AppError = require("../errors/AppError");

exports.getAllQuestions = tryCatch(async (req, res) => {
  const data = await Question.find();

  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.createQuestion = tryCatch(async (req, res) => {
  const file = { ...req.body };

  file.image = req.imgData.downloadURL;

  if (file.sub_question) {
    file.sub_question = file.sub_question.split(",");
  }

  if (file.c_answer && file.type === "MEQ") {
    file.c_answer = file.c_answer.split(",");
  }

  if (file.tags) {
    file.tags = file.tags.split(",");
  }

  if (file.answers && file.type === "MEQ") {
    file.answers = file.answers.split(",");
  }
  const data = await Question.create(file);
  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.deleteQuestion = tryCatch(async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "Success",
  });
});

exports.findAndUpdateQuestion = tryCatch(async (req, res) => {
  const data = await Question.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.getQuestion = tryCatch(async (req, res) => {
  const data = await Question.findById(req.params.id);
  if (data == null) {
    throw new AppError("There is no question with id :" + req.params.id, 400);
  }
  res.status(200).json({
    status: "Success",
    data,
  });
});
