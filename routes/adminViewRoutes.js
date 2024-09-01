const express = require("express");

const router = express.Router();
const viewController = require("../controller/viewController");

// Admin Routes
router.get("/", viewController.getDashboard);
router.get("/create/set", viewController.getCreateSetPage);
router.get("/Questions", viewController.getQuestionPage);

module.exports = router;