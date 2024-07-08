const multer = require("multer");
const sharp = require("sharp");
const Question = require("./../models/questionModel");

exports.getAllQuestions = async (req, res, next) => {
  const data = await Question.find();

  res.status(200).json({
    status: "success",
    data,
  });
  return next();
};

exports.createQuestion = async (req, res, next) => {
  try {
    let file = { ...req.body };

    file.image = req.imgData.downloadURL;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "Bad request",
        message: "You must provide data to create a new question",
      });
    }

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
    console.log(file);
    const data = await Question.create(file);
    res.status(200).json({
      status: "success",
      data,
    });

    next();
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(400).json({
      status: "Bad request",
      message: "Failed to create question. Please try again later.",
    });
  }
};
