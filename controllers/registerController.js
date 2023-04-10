const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/httpError");
const User = require("../models/userSchema");

const register = async (req, res, next) => {
  const { fname, lname, email, password, dob } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    console.error("Error checking existing user with email on signup");
    console.log(error);
    return next(new HttpError("Sign up failed, please try again later", 500));
  }

  if (user)
    return next(
      new HttpError("User already exists, please login instead", 422)
    );

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.error("Error hashing the password on sign up");
    console.log(error);
    return next(new HttpError("Sign up failed, please try again later", 500));
  }

  let newUser = new User({
    fname,
    lname,
    email,
    password: hashedPassword,
    dob: new Date(dob),
  });

  try {
    newUser = await newUser.save();
  } catch (error) {
    console.error("Error saving new user to database");
    console.log(error);
    return next(new HttpError("Sign up failed, please try again later", 500));
  }
  const accessToken = jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
    },
    process.env.JWT_SIGN_SECRET_ACCESS_TOKEN,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
    },
    process.env.JWT_SIGN_SECRET_REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  newUser.tokens = {
    accessToken,
    refreshToken,
  };

  try {
    await newUser.save();
  } catch (error) {
    console.error("Error saving tokens to database on registration");
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

  res.status(200).json({ message: "User registration successful" });
};

module.exports = register;
