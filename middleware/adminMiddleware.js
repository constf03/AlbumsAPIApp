import { StatusCodes } from "http-status-codes";

const checkAdmin = (req, res, next) => {
  const isAdmin = req.user.isAdmin;
  if (!req.user || isAdmin === false) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthrorized" });
  }
  next();
};

export default checkAdmin;
