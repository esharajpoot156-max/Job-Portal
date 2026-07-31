import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { sendMessage, getMessages, getConversations, markAsSeen } from "../controller/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/get/:id").get(isAuthenticated, getMessages);
router.route("/conversations").get(isAuthenticated, getConversations);
router.route("/seen/:id").patch(isAuthenticated, markAsSeen);

export default router;