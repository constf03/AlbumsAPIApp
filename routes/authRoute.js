import express from "express";
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import APIError from "../errors/apiError.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function verify(
    email,
    password,
    cb
  ) {
    try {
      const user = await User.findOne({ email });
      const passwordCorrect = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

      if (!(user && passwordCorrect)) {
        return cb(null, false, { message: "Incorrect email or password." });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", (_req, res) => {
  res.redirect("/login.html");
});

router.get("/register", (_req, res) => {
  res.redirect("/register.html");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

router.post("/register", async (req, res) => {
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

  res.status(StatusCodes.CREATED).redirect("/login");
});

export default router;
