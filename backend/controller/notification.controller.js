import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try{
        const userId = req.id;
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            notifications,
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const markNotificationRead = async (req, res) => {
    try{
        const userId = req.id;
        const notificationId = req.params.id;

        const notification = await Notification.findOne({ _id: notificationId, user: userId });
        if(!notification){
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            message: "Notification marked as read",
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const markAllRead = async (req, res) => {
    try{
        const userId = req.id;
        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            message: "All notifications marked as read",
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}