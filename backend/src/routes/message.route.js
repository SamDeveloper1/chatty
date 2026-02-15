import express from "express";
const router =  express.Router();
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getMessages, sendMessage } from "../controllers/messages.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

router.post("/send/:id",protectRoute, sendMessage)
router.get("/:id",protectRoute, getMessages)
export default router;