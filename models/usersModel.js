const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your first followed by your last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "password should be more than 8 characters"],
    select: false,
  },
  level: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
