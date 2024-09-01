require("dotenv").config({ path: `${__dirname}/config.env` });
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("we're connected to the DB!");
});

const app = require("./app");

const server = app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});

// Global unhandled promise rejection handler
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION❗ SHUTTING DOWN....");
  server.close(() => {
    return process.exit(1);
  });
});

process.on("uncaughtException", (err, origin) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION❗ SHUTTING DOWN....");
  server.close(() => {
    return process.exit(1);
  });
});
