const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SIGN_SECRET_ACCESS_TOKEN,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SIGN_SECRET_REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  user.tokens = {
    accessToken,
    refreshToken,
  };

  try {
    await user.save();
  } catch (error) {
    console.error("Error saving tokens to database on login");
    console.log(error);
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    domain: ".localhost",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    domain: ".localhost",
  });

  res.status(200).json({ message: "User login successful" });
};

module.exports = login;
