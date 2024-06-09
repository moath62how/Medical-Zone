const userController = require("../controller/userController");
const authController = require("../controller/authController");
const { uploadFirebase } = require("../controller/firebaseController");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
