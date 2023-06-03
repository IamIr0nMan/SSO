const HttpError = require("../models/httpError");
const User = require("../models/userSchema");

const logout = async (req, res, next) => {
  const userId = req.body.userId;

  let user;
  try {
    user = User.findById(userId);
  } catch (error) {
    console.log("Error logging out user");
    console.error(error);
    return next(new HttpError("Logout failed, please try again", 500));
  }

  if (!user)
    return next(new HttpError("User does not exist, please sign up", 404));

  user.tokens = {
    accessToken: null,
    refreshToken: null,
  };

  try {
    await user.save();
  } catch (error) {
    console.error("Error saving tokens to database on logout");
    console.log(error);
    return next(new HttpError("Logout failed, please try again", 500));
  }

  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = logout;
