const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const questionController = require("../controller/questionController");
const { uploadFirebase } = require("../controller/firebaseController");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .get(questionController.getAllQuestions)
  .post(
    upload.single("Q_image"),
    uploadFirebase,
    questionController.createQuestion,
  );

module.exports = router;
