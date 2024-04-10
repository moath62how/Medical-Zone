const Set = require("../models/setModel");

exports.getHome = async (req, res, next) => {
  const data = await Set.find();

  res.render("questionCards", { sets: data });
};
