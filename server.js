import express from "express";
import * as dotenv from "dotenv";

import HttpError from "./models/httpError";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

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
