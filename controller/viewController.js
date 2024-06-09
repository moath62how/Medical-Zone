const Set = require("../models/setModel");

exports.getHome = async (req, res, next) => {
  const sets = await Set.find({}, { name: 1, img: 1, _id: 0, type: 1 });

  res.render("questionCards", { sets });
};
exports.getChoice = (choices) => {
  return (req, res, next) => {
    var title = req.path.charAt(0).toUpperCase() + req.path.slice(1);
    title = title.substring(1, title.length - 1);

    res.render("choiceBtn", { choices, title });
  };
};

exports.getQuizInfo = async (req, res, next) => {
  const id = req.params.id;
  res.status(200).render("quizInfo", { id });
};

exports.typeExists = async (req, res, next) => {
  const data = await Set.findOne({ type: req.params.type });
  if (!data) {
    res.status(404).render("error", {
      status: 404,
      message: 'There is no "' + req.params.type + '" Question sets Available',
    });
  } else {
    return next();
  }
};

exports.getQuizStart = async (req, res, next) => {
  const id = req.params.id;

  res.status(200).render("quiz", { id });
};

exports.getLogin = async (req, res, next) => {
  res.status(200).render("login");
};

exports.getDashboard = async (req, res, next) => {
  res.status(200).render("adminDashboard");
};
