import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { MessageSquare, Briefcase, FileText, Users, Bell, Inbox, LifeBuoy } from "lucide-react";

const SEEKER_TYPES = {
    message: { label: "Message", icon: MessageSquare, dot: "bg-blue-500/15 text-blue-500" },
    job_alert: { label: "Job Alert", icon: Briefcase, dot: "bg-emerald-500/15 text-emerald-500" },
    application_status: { label: "Application", icon: FileText, dot: "bg-amber-500/15 text-amber-500" },
    support_reply: { label: "Support Reply", icon: LifeBuoy, dot: "bg-teal-500/15 text-teal-500" },
    general: { label: "General", icon: Bell, dot: "bg-[#8B5CF6]/15 text-[#8B5CF6]" },
};
const EMPLOYER_TYPES = {
    message: { label: "Message", icon: MessageSquare, dot: "bg-blue-500/15 text-blue-500" },
    application_received: { label: "New Applicant", icon: Users, dot: "bg-pink-500/15 text-pink-500" },
    support_reply: { label: "Support Reply", icon: LifeBuoy, dot: "bg-teal-500/15 text-teal-500" },
    general: { label: "General", icon: Bell, dot: "bg-[#8B5CF6]/15 text-[#8B5CF6]" },
};
const ADMIN_TYPES = {
    job_posted: { label: "New Jobs", icon: Briefcase, dot: "bg-emerald-500/15 text-emerald-500" },
    support_request: { label: "Contact/Support", icon: LifeBuoy, dot: "bg-teal-500/15 text-teal-500" },
};

const ROUTES = {
    message: (n) => n.relatedUser && `/chat/${n.relatedUser}`,
    application_received: (n) => n.relatedJob && `/admin/jobs/${n.relatedJob}/applicants`,
    application_status: () => "/my-jobs?tab=applied",
    job_status: (n) => n.relatedJob && `/jobs/${n.relatedJob}`,
    job_alert: (n) => n.relatedJob && `/jobs/${n.relatedJob}`,
    support_reply: () => "/help?tab=mymessages",
    job_posted: () => "/admin/pending-jobs",
    support_request: () => "/admin?tab=support",
};
const timeAgo = (d) => {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString();
};

const Notifications = () => {
    const { user } = useSelector((s) => s.auth);
    const typeMeta = user?.role === "admin" ? ADMIN_TYPES : user?.role === "recruiter" || user?.role === "admin" ? EMPLOYER_TYPES : SEEKER_TYPES;
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notification/get");
            if (res.data.success) setNotifications(res.data.notifications);
        } catch (e) { console.log(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const markRead = async (id) => {
        try { await axiosInstance.patch(`/notification/read/${id}`); fetchNotifications(); }
        catch (e) { console.log(e); }
    };
    const markAllRead = async () => {
        try { await axiosInstance.patch("/notification/read-all"); fetchNotifications(); }
        catch (e) { console.log(e); }
    };
    const deleteNotif = async (id, e) => {
        e.stopPropagation();
        setNotifications((p) => p.filter((n) => n._id !== id));
        try { await axiosInstance.delete(`/notification/${id}`); } catch (err) { console.log(err); }
    };
    const onClick = (n) => {
        if (!n.isRead) markRead(n._id);
        const route = ROUTES[n.type]?.(n);
        if (route) navigate(route);
    };

    const counts = notifications.reduce((a, n) => ({ ...a, [n.type]: (a[n.type] || 0) + 1 }), {});
    const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
    const unread = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Notifications
                    {unread > 0 && <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6]">{unread}</span>}
                </h1>
                <button onClick={markAllRead} disabled={!unread} className={`text-sm font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed ${unread ? "text-[#8B5CF6]" : ""}`}>
                    Mark all as read
                </button>
            </div>

            <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
                {["all", ...Object.keys(typeMeta)].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 capitalize text-sm font-medium border-b-2 transition-colors ${filter === f ? "border-[#8B5CF6] text-[#8B5CF6]" : "border-transparent text-gray-500 dark:text-gray-400"}`}>
                        {f === "all" ? "All" : typeMeta[f]?.label || f}
                        {(f === "all" ? notifications.length : counts[f] || 0) > 0 && (
                            <span className="ml-1 opacity-70">({f === "all" ? notifications.length : counts[f]})</span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? <p>Loading...</p> : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                    <Inbox size={40} className="mb-3 opacity-50" />
                    <p>No notifications yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((n) => {
                        const meta = typeMeta[n.type] || { icon: Bell, dot: "bg-[#8B5CF6]/15 text-[#8B5CF6]" };
                        const Icon = meta.icon;
                        const clickable = !!ROUTES[n.type]?.(n);
                        return (
                            <div key={n._id} onClick={() => onClick(n)}
                                className={`border rounded-xl p-5 dark:border-gray-700 transition ${clickable ? "cursor-pointer hover:shadow-md" : "cursor-default"} ${!n.isRead ? "bg-[#8B5CF6]/5" : ""}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${meta.dot}`}>
                                            <Icon size={16} />
                                        </span>
                                        <h3 className="font-bold text-sm">{typeMeta[n.type]?.label || "Notification"}</h3>
                                    </div>
                                    <button onClick={(e) => deleteNotif(n._id, e)} className="text-red-500 text-sm hover:underline">Delete</button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{n.message}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700 pt-2" title={new Date(n.createdAt).toLocaleString()}>
                                    {timeAgo(n.createdAt)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;