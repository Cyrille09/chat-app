import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyAccessToken } from "../middleware/middleware";
import {
  createGroup,
  deleteGroupPhoto,
  exitFromGroupContact,
  getGroupMmebers,
  muteGroupContact,
  updateGroup,
  updateGroupMembers,
  uploadImage,
} from "../controllers/groupsController";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/groups");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});
const upload = multer({ storage: storage });

const router = Router();

// get routes
router.get("/members/:id", verifyAccessToken, getGroupMmebers);

//post routes
router.post(
  "/exist/:contactId/:groupId",
  verifyAccessToken,
  exitFromGroupContact
);
router.post("/mute/:contactId", verifyAccessToken, muteGroupContact);
router.post("/", verifyAccessToken, createGroup);

// patch routes
router.put(
  "/photo/:id",
  upload.single("photoUrl"),
  verifyAccessToken,
  uploadImage
);
router.patch("/members/:id", verifyAccessToken, updateGroupMembers);
router.patch("/:id", verifyAccessToken, updateGroup);

// delete routes
router.delete("/photo/:id", verifyAccessToken, deleteGroupPhoto);

export default router;
