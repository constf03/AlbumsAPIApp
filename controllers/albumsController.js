import { StatusCodes } from "http-status-codes";
import APIError from "../errors/apiError.js";
import { Album } from "../models/AlbumModel.js";

const getAllAlbums = async (_req, res) => {
  const currentAlbums = await Album.find({});
  if (!currentAlbums) {
    throw new APIError("Albums not found", StatusCodes.NOT_FOUND);
  }
  res.json(currentAlbums);
};

const getAlbumById = async (req, res) => {
  const { id } = req.params;
  const album = await Album.findById(id);
  if (!album) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  }
  res.status(StatusCodes.OK).json(album);
};

const getAlbums = async (req, res) => {
  const { artist, title, genre, year, fields } = req.query;
  const queryObject = {};

  if (artist) {
    const artistRegex = new RegExp(`${artist}`);
    queryObject.artist = { $regex: artistRegex, $options: "i" };
  }

  if (title) {
    const titleRegex = new RegExp(`${title}`);
    queryObject.title = { $regex: titleRegex, $options: "i" };
  }

  if (genre) {
    queryObject.genre = genre;
  }

  if (year) {
    const yearFilter = {};

    if (year.gt) {
      yearFilter.$gt = year.gt;
    }
    if (year.gte) {
      yearFilter.$gte = year.gte;
    }
    if (year.lt) {
      yearFilter.$lt = year.lt;
    }
    if (year.lte) {
      yearFilter.$lte = year.lte;
    }
    if (year.eq) {
      yearFilter.$eq = year.eq;
    }
    queryObject.year = yearFilter;
  }

  let query = Album.find(queryObject);

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    query = query.select(fieldList);
  }

  const albums = await query;

  if (!albums) {
    throw new APIError("Albums not found", StatusCodes.NOT_FOUND);
  }

  return res.status(200).json({ albums, nbHits: albums.length });
};

const createAlbum = async (req, res) => {
  const { artist, title, year, genre, tracks } = req.body;

  if (!artist || !title || !year || !genre || !tracks) {
    throw new APIError("Missing values", StatusCodes.BAD_REQUEST);
  }

  const newAlbum = new Album({
    artist: artist,
    title: title,
    year: year,
    genre: genre,
    tracks: tracks,
  });

  if (!newAlbum) {
    throw new APIError(
      "Failed to create album",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  await newAlbum.save();
  const response = { ...newAlbum.toObject() };
  res.status(201).json(response);
};

const updateAlbum = async (req, res) => {
  const { id } = req.params;
  const { artist, title, year, genre, tracks } = req.body;

  const album = await Album.findById(id);
  if (!album) {
    throw new APIError("Albums not found", StatusCodes.NOT_FOUND);
  }

  album.artist = artist;
  album.title = title;
  album.year = year;
  album.genre = genre;
  album.tracks = tracks;

  if (!artist || !title || !year || !genre || !tracks) {
    throw new APIError("Missing values", StatusCodes.BAD_REQUEST);
  }

  if (album) {
    await album.save();
    res.status(200).json({ message: "Album updated!", data: album });
  } else {
    throw new APIError(
      "Failed to update album",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteAlbum = async (req, res) => {
  const { id } = req.params;
  const result = await Album.findByIdAndDelete(id);
  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  }
  res.status(StatusCodes.OK).json({ message: "Album deleted successfully" });
};

export default {
  getAllAlbums,
  getAlbumById,
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
