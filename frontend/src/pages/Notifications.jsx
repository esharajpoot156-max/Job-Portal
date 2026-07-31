import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notification/get");
            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markReadHandler = async (id) => {
        try {
            await axiosInstance.patch(`/notification/read/${id}`);
            fetchNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    const markAllReadHandler = async () => {
        try {
            await axiosInstance.patch("/notification/read-all");
            fetchNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <button onClick={markAllReadHandler} className="text-sm text-[#8B5CF6]">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <p>No notifications yet.</p>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            onClick={() => !notif.isRead && markReadHandler(notif._id)}
                            className={`p-4 rounded border dark:border-gray-700 cursor-pointer ${
                                notif.isRead
                                    ? "bg-white dark:bg-[#121214]"
                                    : "bg-[#F4F4F5] dark:bg-[#1a1a1d] border-l-4 border-l-[#8B5CF6]"
                            }`}
                        >
                            <p>{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;