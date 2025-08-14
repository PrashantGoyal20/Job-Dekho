import express from "express";
import { isAuthenticated } from "../Middleware/auth.js";
import { chat, chat_starter } from "../Controller/Chat.js";

const router =express.Router();
router.post('/start-chat',chat_starter)
router.post('/question',chat)
export default router;