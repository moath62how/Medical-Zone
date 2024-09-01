const express = require("express");
const multer = require("multer");
const eduModController = require("../controller/eduModController");
const { uploadFirebase } = require("../middleware/firebaseImgMiddelware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .get(eduModController.getAllEduMods)
  .post(
    upload.single("EduMod_image"),
    uploadFirebase,
    eduModController.createEduMod
  );

router
  .route("/:id")
  .get(eduModController.getEdumod)
  .patch(eduModController.findAndUpdateEduMod)
  .delete(eduModController.deleteEduMod);

module.exports = router;
