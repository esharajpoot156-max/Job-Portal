import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { createContact, createReport, getMyTickets } from "../controller/support.controller.js";

const router = express.Router();
router.route("/contact").post(isAuthenticated, createContact);
router.route("/report").post(isAuthenticated, createReport);
router.route("/mine").get(isAuthenticated, getMyTickets);

export default router;