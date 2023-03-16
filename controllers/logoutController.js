import HttpError from "../models/httpError";

export default async function logout(store) {
  return async function (req, res, next) {
    const sessionId = req.session.id;
    store.destroy(sessionId, (err) => {
      if (err) {
        console.error("Error deleting session data from database");
        console.log(err);
        return next(new HttpError("Problem logging out user", 500));
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Error deleting session data from req object");
          console.log(err);
          return next(new HttpError("Problem logging out user", 500));
        }
      });
    });
    res.status(200).json({ message: "User logged out successfully" });
  };
}
