import { Router } from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/middleware";
import {
  sendMessage,
  getMessages,
  getSenderAndReceiverMessages,
  sendImage,
  sendDocument,
  sendGroupMessage,
  sendGroupImage,
  sendGroupDocument,
  getGroupMessages,
  updateMessage,
  addStarToMessage,
  removeStarToMessage,
  sendAudio,
  sendGroupAudio,
} from "../controllers/messagesController";
import path from "path";

// upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/messages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});
const upload = multer({ storage: storage });

// upload documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "documents/messages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});
const uploadDocument = multer({ storage: documentStorage });

// upload audios
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "audio/messages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});
const uploadAudio = multer({ storage: audioStorage });

const router = Router();
// get routes
router.get("/group/:groupId", verifyAccessToken, getGroupMessages);
router.get("/", verifyAccessToken, getMessages);

//post routes
router.post("/send", verifyAccessToken, sendMessage);
router.post("/display", verifyAccessToken, getSenderAndReceiverMessages);

router.post(
  "/send/image",
  upload.single("message"),
  verifyAccessToken,
  sendImage
);
router.post(
  "/send/document",
  uploadDocument.single("message"),
  verifyAccessToken,
  sendDocument
);

router.post(
  "/send/audio",
  uploadAudio.single("message"),
  verifyAccessToken,
  sendAudio
);

router.post(
  "/send/audio/group",
  uploadAudio.single("message"),
  verifyAccessToken,
  sendGroupAudio
);

router.post("/send/group", verifyAccessToken, sendGroupMessage);
router.post(
  "/send/image/group",
  upload.single("message"),
  verifyAccessToken,
  sendGroupImage
);
router.post("/star/:id", verifyAccessToken, addStarToMessage);
router.post("/unstar/:id", verifyAccessToken, removeStarToMessage);

router.post(
  "/send/document/group",
  uploadDocument.single("message"),
  verifyAccessToken,
  sendGroupDocument
);

router.patch("/:id", verifyAccessToken, updateMessage);

export default router;
