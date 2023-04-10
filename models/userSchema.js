const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  dob: { type: Date, required: true },
  tokens: {
    accessToken: { type: String, expires: "1d" },
    refreshToken: { type: String, expires: "30d" },
  },
});

module.exports = mongoose.model("User", userSchema);
