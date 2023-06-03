const express = require("express");

const register = require("../controllers/registerController");
const login = require("../controllers/loginController");
const logout = require("../controllers/logoutController");
const forgotPassword = require("../controllers/forgotPasswordController");
const userInfo = require("../controllers/userInfoController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/userInfo", userInfo);

router.post("/forgotPassword", forgotPassword);

module.exports = router;
