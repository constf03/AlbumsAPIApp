import { Album } from "../models/AlbumModel.js";
import testData from "./testData.json";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

const api = supertest(app);

beforeEach(async () => {
  await Album.deleteMany({});

  const { ObjectId } = mongoose.Types;
  // fix validation errors for _id and updatedAt fields
  const albumsWithCompatibleFields = testData.map((album) => {
    if (album._id && album._id.$oid) {
      album._id = new ObjectId(album._id.$oid);
    }

    if (album.updatedAt && album.updatedAt.$date) {
      album.updatedAt = new Date(album.updatedAt.$date);
    }

    return album;
  });
  await Album.create(albumsWithCompatibleFields);
});

// test route that confirms the exact number of albums returned matches the number in the test database
test("Correct amount of albums returned as JSON", async () => {
  const response = await api
    .get("/api/albums")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(testData.length);
});

// test route that ensures albums can be added successfully
test("A new album can be added", async () => {
  const newAlbum = {
    artist: "Armin Van Buuren",
    title: "A State of Trance 2007",
    year: 2007,
    genre: "Trance",
    tracks: 28,
  };

  await api
    .post("/api/albums")
    .send(newAlbum)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/albums");
  expect(response.body).toHaveLength(testData.length + 1);
});

// test delete album
test("Album can be deleted", async () => {
  const id = "6722875a2bb052af107b1aa7";

  await api
    .delete(`/api/albums/${id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/albums");
  expect(response.body).toHaveLength(testData.length - 1);

  await api
    .get(`/api/albums/${id}`)
    .expect(404)
    .expect("Content-Type", /application\/json/);
});

// test delete album that doesn't exist
test("Can't delete album that doesn't exist", async () => {
  const id = "6722875a2bb052af107b1aa2";
  await api
    .delete(`/api/albums/${id}`)
    .expect(404)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
