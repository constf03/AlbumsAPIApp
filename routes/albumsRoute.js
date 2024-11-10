import express from "express";
import albumsController from "../controllers/albumsController.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", albumsController.getAllAlbums);
router.get("/:id", albumsController.getAlbumById);
router.get("/search", albumsController.getAlbums);
router.post("/", checkAdmin, albumsController.createAlbum);
router.put("/:id", checkAdmin, albumsController.updateAlbum);
router.delete("/:id", checkAdmin, albumsController.deleteAlbum);

export default router;
