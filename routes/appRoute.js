import express from "express";
import { StatusCodes } from "http-status-codes";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, (_req, res) => {
  res.status(StatusCodes.OK).redirect("/app.html");
});

router.get("/api/userdata", checkAuth, (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
});

export default router;
