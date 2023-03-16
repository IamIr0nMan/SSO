import { Router } from "express";

import register from "../controllers/registerController";
import login from "../controllers/loginController";
import logout from "../controllers/logoutController";
import checkSession from "../controllers/checkSessionController";

const routerFunction = (store) => {
  const router = Router();

  router.post("/register", register);

  router.post("/login", login);

  router.get("/logout", logout(store));

  router.get("/checkSession", checkSession(store));

  return router;
};
export default routerFunction;
