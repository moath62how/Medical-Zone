const Set = require("../models/setModel");

exports.getHome = async (req, res, next) => {
  const data = await Set.find();

  res.render("questionCards", { sets: data });
};
exports.getChoice = (choices) => {
  return (req, res, next) => {
    res.render("choiceBtn", { choices });
  };
};
