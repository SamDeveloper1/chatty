import express from "express";
const router = express.Router();

import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,
  markMessagesAsRead,
  reactToMessage,
  
} from "../controllers/messages.controller.js";

import protectRoute from "../middlewares/protectRoute.js";

router.get("/contacts", protectRoute, getAllContacts);
router.get("/chats", protectRoute, getChatPartners);


router.post("/:id/react", protectRoute, reactToMessage);
router.put("/read/:senderId", protectRoute, markMessagesAsRead);

router.get("/:id", protectRoute, getMessagesByUserId);
router.post("/send/:id", protectRoute, sendMessage);

export default router;