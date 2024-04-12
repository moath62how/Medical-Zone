const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");

router.route("/").get(viewController.getHome);

router.route("/:type").get(viewController.getChoice(["FOMSCU"]));

router
  .route("/:type/:faculty")
  .get(
    viewController.getChoice([
      "ANATOMY",
      "HISTO",
      "BIOCHEMI",
      "PHYSIO",
      "GENATICS",
      "PATHO",
      "MICRO",
      "PARA",
      "PHARMA",
    ])
  );

router.route("/:type").get(viewController.getChoice(["FOMSCU"]));

router.route("/create").get((req, res, next) => {
  res.render("addQuestionForm");
});

module.exports = router;
