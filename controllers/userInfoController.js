const HttpError = require("../models/httpError");
const User = require("../models/userSchema");

const userInfo = async (req, res, next) => {
  const { userId } = req.body;

  let user;
  try {
    user = User.findById(userId);
  } catch (error) {
    console.log("Error validating token");
    console.error(error);
    return next(
      new HttpError("Token validation failed, please try again", 500)
    );
  }

  if (!user)
    return next(new HttpError("User does not exist, please sign up", 404));

  res
    .status(200)
    .json({ email: user.email, firstName: user.fname, lastName: user.lname });
};

module.exports = userInfo;
