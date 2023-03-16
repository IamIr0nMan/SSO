import HttpError from "../models/httpError";

export default async function checkSession(store) {
  return async function (req, res, next) {
    if (!res.session.id) {
      res.status(401).json({ message: "User has not logged in previously" });
    } else {
      store.get(req.session.id, function (err, session) {
        if (session.userId === req.session.userId) {
          res
            .status(200)
            .json({ message: "User has been authenticated previously" });
        } else {
          console.error("Error comparing session data");
          console.log(err);
          return next(new HttpError("Problem authenticating user", 500));
        }
      });
    }
  };
}
