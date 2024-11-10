import APIError from "../errors/apiError.js";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, res) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Server error" });
};
