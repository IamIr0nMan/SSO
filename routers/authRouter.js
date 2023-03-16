const express = require("express");

const register = require("../controllers/registerController");
const login = require("../controllers/loginController");
const logout = require("../controllers/logoutController");
const checkSession = require("../controllers/checkSessionController");
const forgotPassword = require("../controllers/forgotPasswordController");

const routerFunction = (store) => {
  const router = express.Router();

  router.post("/register", register);

  router.post("/login", login);

  router.get("/logout", logout(store));

  router.get("/checkSession", checkSession(store));

  router.post("/forgotPassword", forgotPassword);

  return router;
};
module.exports = routerFunction;
