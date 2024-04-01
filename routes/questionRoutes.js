const express = require("express");
const questionsController = require("../controller/questionController");
const router = express.Router();

router.get("/", questionsController.getAllQuestions);

module.exports = router;
