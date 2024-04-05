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
  req.body.image = req.file.filename || null;

  if (JSON.stringify(req.body) === "{}") {
    res.status(400).json({
      status: "Bad request",
      message: "You must provide data to create a new question",
    });
    return;
  }
  try {
    file = {
      ...req.body,
      image: req.imgData.downloadURL,
    };
    data = await Question.create(file);
  } catch (err) {
    return res.status(400).json({
      status: "Bad request",
      message: err,
    });
  }

  res.json({
    status: "success",
    data,
  });
  next();
};
