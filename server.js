import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { MongoDBStore } from "connect-mongodb-session";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import HttpError from "./models/httpError";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: process.env.DATABASE_NAME,
  ttl: 60 * 60 * 24 * 10,
  autoRemove: "native",
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
