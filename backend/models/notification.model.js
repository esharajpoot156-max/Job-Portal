import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["application_status", "application_received", "job_status", "job_alert", "message", "general"],
        default: "general"
    },
    relatedApplication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    },
    relatedJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);