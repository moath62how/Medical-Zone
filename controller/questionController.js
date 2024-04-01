const multer = require("multer");
const sharp = require("sharp");
const Question = require("./../models/questionModel");

exports.getAllQuestions = async (req, res, next) => {
  const data = await Question.find();

  if (!data) {
    res.status(404).json({
      status: "error",
      message: "There is no such data in the database",
    });
  }
  res.status(200).json({
    status: "success",
    data,
  });
};

exports.createQuestion = async (req, res, next) => {};
