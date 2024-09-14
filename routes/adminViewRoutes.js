const express = require("express");

const router = express.Router();
const viewController = require("../controller/viewController");
const { isLoggedIn,restrictedTo } = require("../middleware/isLoggedInMiddelware");


// Admin Routes
router.get("/", viewController.getDashboard);
router.get("/login", viewController.getLogin);
router.get("/create/set", isLoggedIn,restrictedTo("admin"),viewController.getCreateSetPage);
router.get("/Questions",isLoggedIn,restrictedTo("admin"), viewController.getQuestionPage);

module.exports = router;