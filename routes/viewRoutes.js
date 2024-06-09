const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");

router.route("/create").get((req, res, next) => {
  res.render("addQuestionForm");
});

router.route("/login").get(viewController.getLogin);

router.route("/Dashboard").get(viewController.getDashboard);

router.route(["/", "/home"]).get(viewController.getHome);

router.route("/:id([a-fA-F0-9]{24})").get(viewController.getQuizInfo);

router.route("/:id([a-fA-F0-9]{24})/start").get(viewController.getQuizStart);

router.route("/:type").get(viewController.getChoice(["FOMSCU"]));

router
  .route("/:type/:faculty")
  .get(viewController.getChoice(["lectures", "Questions", "Labs"]));
router
  .route("/:type/:faculty/Labs")
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

module.exports = router;
