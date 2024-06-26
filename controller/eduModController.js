const EduMod = require("../models/EduModModel");

exports.createEduMod = async (req, res, next) => {
  try {
    if (req.body.image) {
      req.body.image = req.file.filename || null;
    }
    if (JSON.stringify(req.body) === "{}") {
      res.status(400).json({
        status: "Bad request",
        message: "You must provide data to create a new module",
      });
      return;
    }

    req.body.sets = req.body.sets.split(",");

    file = {
      ...req.body,
      image: req.imgData.downloadURL,
    };
    data = await EduMod.create(file);
  } catch (err) {
    return res.status(400).json({
      status: "Bad request",
      message: err,
    });
  }
  res.status(200).json({
    status: "success",
    data,
  });

  next();
};

exports.getAllEduMods = async (req, res, next) => {
  const data = EduMod.find();

  res.status(200).json({
    status: "success",
    data,
  });
};
