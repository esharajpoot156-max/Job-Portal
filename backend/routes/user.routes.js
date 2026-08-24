import express from "express";
import { login, logout, register, updateProfile, verifyEmail, resendVerification, forgotPassword, resetPassword, toggleSaveJob, getSavedJobs } from "../controller/user.controller.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { singleUpload } from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify/:token").get(verifyEmail);
router.route("/resend-verification").post(resendVerification);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/save-job/:id").post(isAuthenticated, toggleSaveJob);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);

export default router;
