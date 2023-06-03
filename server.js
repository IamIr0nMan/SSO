const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const HttpError = require("./models/httpError");
const apiRouter = require("./routers/apiRouter");
const validateToken = require("./middlewares/validateToken");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(validateToken);
app.use("/api", apiRouter);

app.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/forgotPassword", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "forgotPassword.html"));
});

app.use((req, res, next) => {
  return new HttpError("Could not find this route...", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured..." });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connection to database established");
    app.listen(PORT, () =>
      console.log(`Server Started! Access it on http://localhost:${PORT}/`)
    );
  })
  .catch((err) => console.log(err));
