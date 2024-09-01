const express = require("express");
const multer = require("multer");
const questionController = require("../controller/questionController");
const { uploadFirebase } = require("../middleware/firebaseImgMiddelware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .get(questionController.getAllQuestions)
  .post(
    upload.single("Q_image"),
    uploadFirebase,
    questionController.createQuestion
  );

router
  .route("/:id")
  .get(questionController.getQuestion)
  .patch(questionController.findAndUpdateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
