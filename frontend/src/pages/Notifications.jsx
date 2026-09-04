import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { MessageSquare, Briefcase, FileText, Users, Bell, Trash2, CheckCheck, Inbox } from "lucide-react";

const PURPLE = "#8B5CF6";

const SEEKER_TYPES = {
    message: { label: "Message", icon: MessageSquare, color: "#3B82F6" },
    job_alert: { label: "Job Alert", icon: Briefcase, color: "#10B981" },
    application_status: { label: "Application", icon: FileText, color: "#F59E0B" },
    general: { label: "General", icon: Bell, color: PURPLE },
};

const EMPLOYER_TYPES = {
    message: { label: "Message", icon: MessageSquare, color: "#3B82F6" },
    application_received: { label: "New Applicant", icon: Users, color: "#EC4899" },
    job_status: { label: "Job Posting", icon: Briefcase, color: "#10B981" },
    general: { label: "General", icon: Bell, color: PURPLE },
};

const timeAgo = (d) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString();
};

const getNotificationRoute = (notif) => {
    switch (notif.type) {
        case "message":
            return notif.relatedUser ? `/chat/${notif.relatedUser}` : null;
        case "application_received":
            return notif.relatedJob ? `/admin/jobs/${notif.relatedJob}/applicants` : null;
        case "application_status":
            return "/my-jobs?tab=applied";
        case "job_status":
        case "job_alert":
            return notif.relatedJob ? `/jobs/${notif.relatedJob}` : null;
        default:
            return null;
    }
};

const Notifications = () => {
    const { user } = useSelector((s) => s.auth);
    const isEmployer = user?.role === "recruiter" || user?.role === "admin";
    const typeMeta = isEmployer ? EMPLOYER_TYPES : SEEKER_TYPES;
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notification/get");
            if (res.data.success) setNotifications(res.data.notifications);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const markReadHandler = async (id) => {
        try { await axiosInstance.patch(`/notification/read/${id}`); fetchNotifications(); }
        catch (error) { console.log(error); }
    };

    const markAllReadHandler = async () => {
        try { await axiosInstance.patch("/notification/read-all"); fetchNotifications(); }
        catch (error) { console.log(error); }
    };

    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        try { await axiosInstance.delete(`/notification/${id}`); }
        catch (error) { console.log(error); }
    };

    const notificationClickHandler = (notif) => {
        if (!notif.isRead) markReadHandler(notif._id);
        const route = getNotificationRoute(notif);
        if (route) navigate(route);
    };

    const counts = notifications.reduce((a, n) => ({ ...a, [n.type]: (a[n.type] || 0) + 1 }), {});
    const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="text-xs font-semibold text-white rounded-full px-2 py-0.5" style={{ backgroundColor: PURPLE }}>
                            {unreadCount}
                        </span>
                    )}
                </h1>
                <button
                    onClick={markAllReadHandler}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-1 text-sm hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                    style={{ color: unreadCount === 0 ? undefined : PURPLE }}
                >
                    <CheckCheck size={16} /> Mark all as read
                </button>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                {["all", ...Object.keys(typeMeta)].map((f) => {
                    const count = f === "all" ? notifications.length : counts[f] || 0;
                    const active = filter === f;
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-3 py-1 rounded-full text-sm border transition dark:border-gray-700"
                            style={active ? { backgroundColor: PURPLE, borderColor: PURPLE, color: "#fff" } : {}}
                        >
                            {f === "all" ? "All" : typeMeta[f]?.label || f}
                            {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                    <Inbox size={40} className="mb-3 opacity-50" />
                    <p>No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((notif) => {
                        const meta = typeMeta[notif.type] || { icon: Bell, color: PURPLE };
                        const Icon = meta.icon;
                        const isClickable = !!getNotificationRoute(notif);
                        return (
                            <div
                                key={notif._id}
                                onClick={() => notificationClickHandler(notif)}
                                className={`group p-4 rounded border dark:border-gray-700 transition hover:shadow-md hover:-translate-y-0.5 ${
                                    isClickable ? "cursor-pointer" : "cursor-default"
                                } ${
                                    notif.isRead
                                        ? "bg-white dark:bg-[#121214]"
                                        : "bg-[#F4F4F5] dark:bg-[#1a1a1d] border-l-4 border-l-[#8B5CF6]"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                                        style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                                    >
                                        <Icon size={16} />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p>{notif.message}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" title={new Date(notif.createdAt).toLocaleString()}>
                                            {timeAgo(notif.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteNotification(notif._id, e)}
                                        className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 shrink-0"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;