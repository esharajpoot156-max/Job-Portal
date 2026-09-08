import { SupportTicket } from "../models/support.model.js";
import { Notification } from "../models/notification.model.js";
import { user as User } from "../models/user.model.js";

export const createContact = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const ticket = await SupportTicket.create({ user: req.id, kind: "contact", subject, message });

        const admins = await User.find({ role: "admin" }).select("_id");
        if (admins.length) {
            await Notification.insertMany(
                admins.map((a) => ({
                    user: a._id,
                    message: `New contact message: "${subject || "No subject"}"`,
                    type: "support_request",
                    relatedUser: req.id
                }))
            );
        }

        return res.status(201).json({ success: true, message: "Message sent" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createReport = async (req, res) => {
    try {
        const { issueType, description } = req.body;
        await SupportTicket.create({ user: req.id, kind: "report", issueType, message: description });
        return res.status(201).json({ success: true, message: "Report submitted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getMyTickets = async (req, res) => {
    const tickets = await SupportTicket.find({ user: req.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tickets });
};