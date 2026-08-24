import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import isAdmin from "../Middlewares/isAdmin.js";
import { getDashboardStats, getAllUsers, deleteUser, getAllCompanies } from "../controller/admin.controller.js";

const router = express.Router();

router.route("/stats").get(isAuthenticated, isAdmin, getDashboardStats);
router.route("/users").get(isAuthenticated, isAdmin, getAllUsers);
router.route("/users/:id").delete(isAuthenticated, isAdmin, deleteUser);
router.route("/companies").get(isAuthenticated, isAdmin, getAllCompanies);

export default router;