import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { getNotifications, markNotificationRead, markAllRead } from "../controller/notification.controller.js";

const router = express.Router();

router.route("/get").get(isAuthenticated, getNotifications);
router.route("/read/:id").patch(isAuthenticated, markNotificationRead);
router.route("/read-all").patch(isAuthenticated, markAllRead);

export default router;