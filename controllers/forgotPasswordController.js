const bcrypt = require("bcrypt");

const HttpError = require("../models/httpError");
const User = require("../models/userSchema");

const forgotPassword = async (req, res, next) => {
  const { email, newPassword, dob } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    console.error("Error checking existing user on password reset");
    console.log(error);
    return next(new HttpError("Password reset failed, please try again", 500));
  }

  if (!user)
    return next(new HttpError("User does not exist, please sign up", 404));

  if (user.dob != new Date(dob))
    return next(
      new HttpError(
        "Invalid date of birth, can't reset password, please try again",
        401
      )
    );

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (error) {
    console.error("Error hashing the password when resetting password");
    console.log(error);
    return next(
      new HttpError("Password reset failed, please try again later", 500)
    );
  }

  user.password = hashedPassword;

  try {
    user = await user.save();
  } catch (error) {
    console.error("Error updating password of user to database");
    console.log(error);
    return next(
      new HttpError("Password reset failed, please try again later", 500)
    );
  }

  res.status(200).json({ message: "Password reset successful" });
};

module.exports = forgotPassword;
