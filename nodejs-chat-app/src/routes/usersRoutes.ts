import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  changeUserProfilePassword,
  createUser,
  deleteUser,
  deleteUserPhoto,
  getUser,
  getUserProfile,
  getUsers,
  login,
  updateUser,
  updateUserProfile,
  uploadImage,
} from "../controllers/usersController";
import { verifyAccessToken } from "../middleware/middleware";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});
const upload = multer({ storage: storage });

const router = Router();
// get routes
router.get("/me", verifyAccessToken, getUserProfile);
router.get("/", verifyAccessToken, getUsers);
router.get("/:id", verifyAccessToken, getUser);

//post routes
router.post("/login", login);
router.post(
  "/changeUserProfilePassword",
  verifyAccessToken,
  changeUserProfilePassword
);
router.post("/", createUser);

// patch routes
router.patch("/me", verifyAccessToken, updateUserProfile);
router.patch("/:id", verifyAccessToken, updateUser);

// put router
router.put(
  "/photo/me",
  upload.single("photoUrl"),
  verifyAccessToken,
  uploadImage
);

// delete routes
router.delete("/photo/me", verifyAccessToken, deleteUserPhoto);
router.delete("/:id", verifyAccessToken, deleteUser);

export default router;
