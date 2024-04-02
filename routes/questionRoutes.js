const express = require("express");
const questionsController = require("../controller/questionController");
const router = express.Router();

router
  .route("/")
  .get(questionsController.getAllQuestions)
  .post(questionsController.createQuestion);

module.exports = router;
