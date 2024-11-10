import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [40, "Name cannot be longer than 40 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    passwordHash: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    albums: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
  },
  { strict: false }
);

userSchema.pre("save", async function (next) {
  const user = this;
  const saltRounds = 10;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.passwordHash, salt, function (err, hash) {
      if (err) return next(err);
      user.passwordHash = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

export const User = model("User", userSchema);
