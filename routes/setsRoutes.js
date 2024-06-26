const setsController = require("../controller/setsController");
const { uploadFirebase } = require("../controller/firebaseController");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.route("/").get(setsController.getAllSets).post(setsController.createSet);

router
  .route("/:id")
  .patch(setsController.findAndUpdateSet)
  .get(setsController.getSet);
module.exports = router;
