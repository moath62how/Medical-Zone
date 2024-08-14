const express = require("express");

const router = express.Router();
const viewController = require("../controller/viewController");

// General Routes
router.get(["/", "/home"], viewController.getHome);

// Routes for Authentication

router.get("/login", viewController.getLogin); // Still in development

// Admin Routes
router.get("/Dashboard", viewController.getDashboard);
router.get("/Dashboard/create/set", viewController.getCreateSetPage);

// Dynamic Routes for Exams
router.get("/:id([a-fA-F0-9]{24})", viewController.getQuizInfo);
router.get("/:id([a-fA-F0-9]{24})/start", viewController.getQuizStart);

// Routes with Type of Question Set
router.get("/:eduMod", viewController.getChoice(["FOMSCU"]));
router.get(
  "/:eduMod/:faculty",
  viewController.getChoice(["Lectures", "Seminars", "Labs"]),
);

// Specific Routes for Questions
router.get(
  "/:eduMod/:faculty/labs/",
  viewController.getChoice(["Summary", "OSPE"]),
);
router.get(
  "/:eduMod/:faculty/lectures/",
  viewController.getChoice(["Summary", "MCQ"]),
);

// Placeholder Routes
router.get(
  ["/:eduMod/:faculty/labs/Summary", "/:eduMod/:faculty/lectures/Summary"],
  (req, res) => {
    res.send("To be implemented...");
  },
);

router.get(
  ["/:eduMod/:faculty/labs/OSPE", "/:eduMod/:faculty/lectures/MCQ"],
  viewController.getChoice(["Previous", "Customize", "MZ Questions"]),
);

router.get("/:eduMod/:faculty/labs/OSPE/Previous", viewController.getPrevious);

router.get("/:eduMod/:faculty/labs/OSPE/Previous/:id", (req, res, next) => {
  console.log("/" + req.params.id);
  res.redirect("/" + req.params.id);
});

// Uncommented Legacy or Unfinished Routes
// router.get("/:eduMod/:faculty/Questions/OSPE/:");
// router.get(
//   "/:eduMod/:faculty/Labs",
//   viewController.getChoice([
//     "ANATOMY",
//     "HISTO",
//     "BIOCHEMI",
//     "PHYSIO",
//     "GENATICS",
//     "PATHO",
//     "MICRO",
//     "PARA",
//     "PHARMA",
//   ])
// );

// router.get("/create", (req, res) => {
//   res.render("addQuestionForm");
// });

// Commented Out Test Routes
// router.get("/err", (req, res, next) => {
//   res.status(404).render("error", {
//     status: 404,
//     message: 'There is no "' + req.params.type + '" Question sets Available',
//   });
//   next();
// });

// router.get("/test", (req, res, next) => {
//   const id = "6688203347390c06b16cc108";
//   res.status(200).render("mcq", { id });
// });

module.exports = router;
