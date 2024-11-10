import { StatusCodes } from "http-status-codes";

const checkAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).redirect("/unauthorized.html");
  }
  next();
};

export default checkAuth;
