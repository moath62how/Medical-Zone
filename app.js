require("dotenv").config({ path: __dirname + "/config.env" });
const express = require("express");
const morgan = require("morgan");
const path = require("path");
// var cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const bodyParser = require("body-parser");
const questionRoutes = require("./routes/questionRoutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mongoose.connect(process.env.DATABASE);

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("we're connected to the DB!");
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("view engine", "pug");

const server = app.listen(process.env.PORT, () => {
  console.log("App is listening on port 3000");
});

app.get("/", (req, res) => {
  res.send("hello ,world!");
});

app.use("/api/v1/questions", questionRoutes);

app.use("/api/v1/sets", questionRoutes);

app.use("./create", (req, res, next) => {});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION❗ SHUTTING DOWN....  ");
  server.close(() => process.exit(1));
});
