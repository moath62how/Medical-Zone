const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");

// router.get("/err", (req, res, next) => {
//   res.status(404).render("error", {
//     status: 404,
//     message: 'There is no "' + req.params.type + '" Question sets Available',
//   });
//   next();
// });

router.get("/test", (req, res, next) => {
  res.status(200).render("mcq");
});

// Render forms for ading questions
router.get("/create", (req, res) => {
  res.render("addQuestionForm");
});

//Still in development
router.get("/login", viewController.getLogin);

// only for admins
router.get("/Dashboard", viewController.getDashboard);
router.get("/Dashboard/create/set", viewController.getCreateSetPage);

// General routes
router.get(["/", "/home"], viewController.getHome);

// Routes with dynamic parameters for Starting the Exams page
router.get("/:id([a-fA-F0-9]{24})", viewController.getQuizInfo);
router.get("/:id([a-fA-F0-9]{24})/start", viewController.getQuizStart);

// Routes with type of the Question Set
router.get("/:type", viewController.getChoice(["FOMSCU"]));
router.get(
  "/:type/:faculty",
  viewController.getChoice(["Lectures", "Seminars", "Labs"])
);

// Routes for Questions

router.get(
  "/:type/:faculty/labs/",
  viewController.getChoice(["Summary", "OSPE"])
);

router.get(
  "/:type/:faculty/lectures/",
  viewController.getChoice(["Summary", "MCQ"])
);

router.get(
  ["/:type/:faculty/labs/:format", "/:type/:faculty/lectures/:format"],
  viewController.getChoice(["Previous", "Customize", "MZ Questions"])
);

// router.get("/:type/:faculty/Questions/OSPE/Previous");

// Routes for Labs
router.get(
  "/:type/:faculty/Labs",
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
