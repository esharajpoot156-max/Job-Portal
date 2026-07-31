import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import isAdmin from "../Middlewares/isAdmin.js";
import { getAdminJobs, getAllJob, getJobById, postJob, getPendingJobs, updateJobStatus } from "../controller/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob); 
router.route("/get").get(isAuthenticated, getAllJob);
router.route("/getadminJobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById); 
router.route("/pending").get(isAuthenticated, isAdmin, getPendingJobs);
router.route("/status/:id").patch(isAuthenticated, isAdmin, updateJobStatus);

export default router;