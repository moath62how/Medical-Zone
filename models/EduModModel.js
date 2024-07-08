const mongoose = require("mongoose");

const EduModSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  sets: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Set",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EduMod = mongoose.model("EduMod", EduModSchema);
module.exports = EduMod;
