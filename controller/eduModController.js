const EduMod = require("../models/EduModModel");
const { tryCatch } = require("../errors/catchAsync");
const AppError = require("../errors/AppError");

exports.createEduMod = tryCatch(async (req, res) => {
  if (req.body.image) {
    req.body.image = req.file.filename || null;
  }

  req.body.sets = req.body.sets.split(",");

  file = {
    ...req.body,
    image: req.imgData.downloadURL,
  };
  data = await EduMod.create(file);

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getAllEduMods = tryCatch(async (_req, res) => {
  const data = await EduMod.find();

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getEdumod = tryCatch((req, res) => {
  const data = EduMod.findById(req.params.id);
  if (data == null) {
    throw new AppError("There is no question with id :" + req.params.id, 400);
  }
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.deleteEduMod = tryCatch(async (req, res) => {
  await EduMod.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "Success",
  });
});

exports.findAndUpdateEduMod = tryCatch(async (req, res) => {
  data = await EduMod.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: "Success",
    data,
  });
});
