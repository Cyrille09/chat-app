import { Router } from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/middleware";
import path from "path";
import {
  deleteStoryFeed,
  getContactUserStoryFeeds,
  sendStoryFeed,
  sendStoryFeedImageOrVideo,
} from "../controllers/storyFeedController";

// upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/stories");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});
const upload = multer({ storage: storage });

const router = Router();
// get routes
router.get("/display", verifyAccessToken, getContactUserStoryFeeds);

//post routes
router.post("/send", verifyAccessToken, sendStoryFeed);
router.post(
  "/send/image",
  upload.single("message"),
  verifyAccessToken,
  sendStoryFeedImageOrVideo
);

// delete routes
router.delete("/:id", verifyAccessToken, deleteStoryFeed);

export default router;
