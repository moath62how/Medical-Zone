const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const questionsController = require("../controller/questionController");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/data/Question_img");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

router
  .route("/")
  .get(questionsController.getAllQuestions)
  .post(upload.single("Q_image"), questionsController.createQuestion);

module.exports = router;
