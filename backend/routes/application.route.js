import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controller/application.controller.js";
import { singleUpload } from "../utils/multer.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, singleUpload, applyJob);
router.route("/get").get(isAuthenticated,getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated,getApplicants);
router.route("/status/:id/update").post(isAuthenticated,updateStatus);

export default router;