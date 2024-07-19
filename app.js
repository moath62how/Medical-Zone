require("dotenv").config({ path: __dirname + "/config.env" });
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const csurf = require("csurf");
const questionRoutes = require("./routes/questionRoutes");
const setsRoutes = require("./routes/setsRoutes");
const viewRoutes = require("./routes/viewRoutes");
const EduModRoutes = require("./routes/eduModRoutes");

const app = express();

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);

// Enable CORS
app.use(cors());

// Logging middleware for development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting middleware
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per window (here, per hour)
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Connect to MongoDB
mongoose.connect(
  process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected to the DB!");
});

// Body parser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Use cookie parser
app.use(cookieParser());

// CSRF protection
app.use(csurf({ cookie: true }));

// Middleware to pass CSRF token to views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Set Pug as the view engine
app.set("view engine", "pug");

// Routes
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/sets", setsRoutes);
app.use("/api/v1/EduMod", EduModRoutes);
app.use("/", viewRoutes);

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});

// Global unhandled promise rejection handler
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION❗ SHUTTING DOWN....");
  server.close(() => process.exit(1));
});

//TODO Move this function to a file in the script folder
// const fs = require("fs");
// const Question = require("./models/questionModel");

// async function getQuestionId() {
//   var arr = [];
//   try {
//     const data = await Question.find();
//     data.forEach((ele) => {
//       arr.push("'" + ele.id + "'");
//     });
//   } catch (err) {
//     console.log(err);
//   }
//   fs.writeFileSync(`${__dirname}/text.txt`, arr.join(","));
// }

// getQuestionId();
