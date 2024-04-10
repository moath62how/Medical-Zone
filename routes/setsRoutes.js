const setsController = require("../controller/setsController");
const { uploadFirebase } = require("../controller/firebaseController");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .get(setsController.getAllSets)
  .post(upload.single("S_image"), uploadFirebase, setsController.createSet);

router
  .route("/:id")
  .patch(
    upload.single("S_image"),
    uploadFirebase,
    setsController.findAndUpdateSet
  )
  .get(setsController.getSet);
module.exports = router;
