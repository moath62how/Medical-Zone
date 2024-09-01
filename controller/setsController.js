const Sets = require("../models/setModel");
const { tryCatch } = require("../errors/catchAsync");
const AppError = require("../errors/AppError");

exports.createSet = tryCatch(async (req, res, next) => {
  data = await Sets.create(req.body);

  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.getAllSets = tryCatch(async (req, res, next) => {
  data = await Sets.find(req.body);
  console.log(req.query);
  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.findAndUpdateSet = tryCatch(async (req, res, next) => {
  data = await Sets.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.getSet = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Sets.findById(id).populate("questions");

  if (data == null) {
    return next(new AppError("There is no set with id :" + req.params.id, 400));
  }

  res.status(200).json({
    status: "Success",
    data,
  });
});

exports.deleteSet = tryCatch(async (req, res) => {
  await Sets.findByIdAndDelete(req.params.id);
  res.status(204);
});
