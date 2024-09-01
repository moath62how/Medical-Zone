const express = require("express");
const setsController = require("../controller/setsController");

const router = express.Router();

router.route("/").get(setsController.getAllSets).post(setsController.createSet);

router
  .route("/:id")
  .patch(setsController.findAndUpdateSet)
  .get(setsController.getSet)
  .delete(setsController.deleteSet);

module.exports = router;
