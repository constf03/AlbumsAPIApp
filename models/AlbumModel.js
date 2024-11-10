import { Schema, model } from "mongoose";

const albumSchema = new Schema({
  artist: {
    type: String,
    required: [true, "Artist name is required."],
    minLength: [3, "Input must be at least 3 characters long."],
    maxLength: [50, "Input cannot be over 50 characters long."],
  },
  title: {
    type: String,
    required: [true, "Artist name is required."],
    minLength: [3, "Input must be at least 3 characters long."],
    maxLength: [50, "Input cannot be over 50 characters long."],
  },
  year: {
    type: Number,
    min: [1900, "Release year must be within acceptable range."],
    max: [2050, "Release year must be within acceptable range."],
  },
  genre: {
    type: String,
    enum: {
      values: [
        "Pop",
        "Rock",
        "Jazz",
        "Jazz Rock",
        "Trance",
        "Blues",
        "Country",
        "Techno",
        "Electronic",
        "Hip Hop",
      ],
      message: "{VALUE} not available",
    },
  },
  tracks: {
    type: Number,
    min: [1, "Tracks amount must be within acceptable range."],
    max: [100, "Tracks amount must be within acceptable range."],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

albumSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Album = model("Album", albumSchema);
