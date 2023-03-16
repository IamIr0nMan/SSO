const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoDBStore = require("connect-mongo");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const HttpError = require("./models/httpError");
const routerFunction = require("./routers/authRouter");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const store = MongoDBStore.create({
  uri: process.env.MONGODB_URL,
  collection: process.env.DATABASE_NAME,
  ttl: 60 * 60 * 24 * 10,
});

store.on("error", (error) => {
  console.log(error);
});

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true },
    store: store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.send("Hello from server");
});

app.use("/auth", routerFunction(store));

app.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.use((req, res, next) => {
  return new HttpError("Could not find this route...", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured..." });
});

app.listen(PORT, () => {
  console.log(`Access it on https://localhost:${PORT}/`);
});
