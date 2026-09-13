import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind: { type: String, enum: ["contact", "report"], required: true },
    subject: String,           
    issueType: String,       
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "replied", "closed"], default: "open" },
    reply: String,
    repliedAt: Date,
}, { timestamps: true });

export const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);