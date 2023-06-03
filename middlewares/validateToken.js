const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new HttpError("No token provided", 401));
  }

  try {
    const payload = jwt.verify(token, secretKey);
    req.body = payload;
    console.log(req.body);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new HttpError("Token has expired", 401));
    } else {
      return next(HttpError("Invalid token", 401));
    }
  }
};
