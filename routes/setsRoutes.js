const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { uploadFirebase } = require("../controller/firebaseController");
const setsController = require('../controller/setsController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.route("/").get(setsController.getAllSets).post(setsController.createSet);

router
  .route("/:id")
  .patch(setsController.findAndUpdateSet)
  .get(setsController.getSet);
module.exports = router;
