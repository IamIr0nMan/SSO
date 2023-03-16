const bcrypt = require("bcrypt");

const HttpError = require("../models/httpError");
const User = require("../models/userSchema");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    console.error("Error checking existing user on login");
    console.log(error);
    return next(new HttpError("Login failed, please try again", 500));
  }

  if (!user)
    return next(new HttpError("User does not exist, please sign up", 404));

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error("Error comparing hashed password on login");
    console.log(error);
    return next(new HttpError("Login failed, please try again later", 500));
  }

  if (!isValidPassword)
    return next(new HttpError("Invalid Credentials, please try again", 401));

  req.session.userId = user._id;
  req.session.email = user.email;

  res.status(200).json({ message: "User login successful" });
};

module.exports = login;
