const express = require("express");
const router = express.Router();
const viewControlller = require("../controller/viewController");

router.route("/").get(viewControlller.getHome);

router.route("/create").get((req, res, next) => {
  res.render("addQuestionForm");
});

module.exports = router;
