const Sets = require('../models/setModel');

exports.createSet = async (req, res, next) => {
  try {
    data = await Sets.create(req.body);

    res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};

exports.getAllSets = async (req, res, next) => {
  data = await Sets.find(req.body);

 

  res.status(200).json({
    status: "Success",
    data,
  });
};

exports.findAndUpdateSet = async (req, res, next) => {
  try {
    data = await Sets.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};

exports.getSet = async (req, res, next) => {
  const { id } = req.params;
  const data = await (await Sets.findById(id)).populate("questions");

  res.status(200).json({
    status: "OK",
    data,
  });
};
