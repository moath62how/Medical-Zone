const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require('express-session');
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const questionRoutes = require("./routes/questionRoutes");
const setsRoutes = require("./routes/setsRoutes");
const authRoutes = require("./routes/authRoutes");
const viewRoutes = require("./routes/viewRoutes");
const adminViewRoutes = require("./routes/adminViewRoutes");
const EduModRoutes = require("./routes/eduModRoutes");
const { globalErrorHandler } = require("./errors/globalErrorHandler");
require("./middleware/authMiddleware");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://firebasestorage.googleapis.com"],
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
  max: 100, // Limit each IP to 100 requests per window
  windowMs: 60 * 60 * 1000, // time is in ms
  message: "Too many requests from this IP, please try again in an hour!",
});

if (process.env.NODE_ENV !== "development") app.use("/api", limiter);

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


// Configure express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Set Pug as the view engine
app.set("view engine", "pug");

// Routes 
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/sets", setsRoutes);
app.use("/api/v1/EduMod", EduModRoutes);
app.use("/Dashboard", adminViewRoutes);
app.use("/auth",authRoutes)
app.use("/", viewRoutes);


app.use("*", globalErrorHandler);

module.exports = app;
