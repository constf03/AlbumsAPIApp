import express from "express";
import { User } from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import APIError from "../errors/apiError.js";
import bcrypt from "bcrypt";
import checkAdmin from "../middleware/adminMiddleware.js";
import { Album } from "../models/AlbumModel.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// create user (with response that returns body in json)
router.post("/api/users", async (req, res) => {
  const { name, email, password } = req.body;
  const emailTaken = await User.findOne({ email });

  if (emailTaken) {
    throw new APIError("Email is already in use", StatusCodes.CONFLICT);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name: name,
    email: email,
    passwordHash: passwordHash,
  });

  await newUser.save();

  const response = { ...newUser.toObject(), passwordHash: undefined };
  res.status(StatusCodes.CREATED).json({ success: true, data: response });
});

// update user data
router.put("/api/userdata/:id", checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, isAdmin } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "User not found" });
  }
  user.name = name;
  user.isAdmin = isAdmin;

  await user.save();
  res.status(StatusCodes.OK).json({ success: true, data: user });
});

router.delete("/api/users/:id", checkAdmin, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Not found" });
  }
  await user.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Successfully deleted user", data: user });
});

// create user-specific albums
router.post("/api/users/:id/albums", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { artist, title, year, genre, tracks } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Not found" });
  }

  const newAlbum = new Album({
    artist: artist,
    title: title,
    year: year,
    genre: genre,
    tracks: tracks,
  });

  await newAlbum.save();

  user.albums.push(newAlbum._id);

  await user.save();
  res.status(StatusCodes.CREATED).json({ success: true, data: user });
});

export default router;
