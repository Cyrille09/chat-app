import { Router } from "express";

import { verifyAccessToken } from "../middleware/middleware";
import {
  clearUserContactChat,
  blockUserContacts,
  createUserContacts,
  deleteUserContact,
  getRequestUserContact,
  getUserContacts,
  muteUserContacts,
  disappearContactUserMessage,
} from "../controllers/userContactsController";

const router = Router();
// get routes
router.get("/list", verifyAccessToken, getUserContacts);
router.get("/request", verifyAccessToken, getRequestUserContact);

//post routes
router.post("/clearchat", verifyAccessToken, clearUserContactChat);
router.post("/block", verifyAccessToken, blockUserContacts);
router.post("/mute", verifyAccessToken, muteUserContacts);
router.post("/disappear", verifyAccessToken, disappearContactUserMessage);

router.post("/", verifyAccessToken, createUserContacts);

// delete routes
router.delete("/:id", verifyAccessToken, deleteUserContact);

export default router;
