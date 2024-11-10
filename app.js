import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import albumsRoute from "./routes/albumsRoute.js";
import connectMongoDB from "./db/mongodb.js";
import { errorHandlerMiddleware } from "./middleware/errorHandler.js";
import { notFoundMiddleware } from "./middleware/notFound.js";
import session from "express-session";
import passport from "passport";
import MongoDBStore from "connect-mongo";
import authRoute from "./routes/authRoute.js";
import appRoute from "./routes/appRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("public")));

app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDBStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "passport-sessions",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", appRoute);
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/api/albums", albumsRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectMongoDB(process.env.MONGO_URI);
    console.log("Successfully estabilished connection to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on ${HOST}`));
  } catch (error) {
    console.log(error);
  }
};

start();

export default app;
