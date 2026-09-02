import express from "express";
import { login, logout, register, updateProfile, verifyEmail, resendVerification, forgotPassword, resetPassword, toggleSaveJob, getSavedJobs, changePassword, updatePrivacy, updateNotificationPreferences, getBlockedUsers, blockUser, unblockUser, deleteAccount } from "../controller/user.controller.js";
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
router.route("/change-password").post(isAuthenticated, changePassword);
router.route("/update-privacy").post(isAuthenticated, updatePrivacy);
router.route("/update-notifications").post(isAuthenticated, updateNotificationPreferences);
router.route("/blocked").get(isAuthenticated, getBlockedUsers);
router.route("/block/:id").post(isAuthenticated, blockUser);
router.route("/unblock/:id").post(isAuthenticated, unblockUser);
router.route("/delete-account").delete(isAuthenticated, deleteAccount);

export default router;