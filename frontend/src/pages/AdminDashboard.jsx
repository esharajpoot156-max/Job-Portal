import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const roleLabel = (role) => (role === "recruiter" ? "Employer" : "Job Seeker");

const Field = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
    </div>
);

const ConfirmModal = ({ target, onCancel, onConfirm }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-[#1a1a1d] rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-2">Delete {target.type}?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to permanently delete <span className="font-semibold">{target.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium border dark:border-gray-700">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white">Delete</button>
            </div>
        </div>
    </div>
);

const statusStyles = {
    open: "bg-amber-500/15 text-amber-500",
    replied: "bg-blue-500/15 text-blue-500",
    closed: "bg-emerald-500/15 text-emerald-500",
};

const TicketCard = ({ t, onReply, onClose }) => {
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);

    const senderName = t.user?.role === "recruiter" ? t.user?.companyName : t.user?.fullname;

    const handleReply = async () => {
        if (!replyText.trim()) return;
        setSending(true);
        await onReply(t._id, replyText);
        setSending(false);
        setReplyText("");
    };

    return (
        <div className="border rounded-xl p-5 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{t.kind === "contact" ? (t.subject || "Contact message") : (t.issueType || "Report")}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{senderName} · {t.user?.email} · {roleLabel(t.user?.role)}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${statusStyles[t.status]}`}>{t.status}</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">{t.message}</p>

            {t.reply && (
                <div className="bg-gray-50 dark:bg-[#1a1a1d] rounded-lg p-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Your reply</p>
                    <p className="text-sm dark:text-gray-200">{t.reply}</p>
                </div>
            )}

            {t.status !== "closed" && (
                <div className="flex gap-2">
                    <input type="text" placeholder="Type a reply..." value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white text-sm" />
                    <button onClick={handleReply} disabled={sending} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#8B5CF6] text-white disabled:opacity-50">
                        {sending ? "Sending..." : "Reply"}
                    </button>
                    <button onClick={() => onClose(t._id)} className="px-4 py-2 rounded-lg text-sm font-medium border dark:border-gray-700">Close</button>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const [searchParams] = useSearchParams();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
    const [userRoleTab, setUserRoleTab] = useState("jobseekers");
    const [ticketKindTab, setTicketKindTab] = useState("contact");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [companySearch, setCompanySearch] = useState("");
    const [confirmTarget, setConfirmTarget] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const [s, u, c, t] = await Promise.all([
                    axiosInstance.get("/admin/stats"),
                    axiosInstance.get("/admin/users"),
                    axiosInstance.get("/admin/companies"),
                    axiosInstance.get("/admin/support"),
                ]);
                if (s.data.success) setStats(s.data.stats);
                if (u.data.success) setUsers(u.data.users);
                if (c.data.success) setCompanies(c.data.companies);
                if (t.data.success) setTickets(t.data.tickets);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const confirmDelete = async () => {
        const { type, id } = confirmTarget;
        setConfirmTarget(null);
        try {
            const res = await axiosInstance.delete(`/admin/${type === "user" ? "users" : "companies"}/${id}`);
            if (res.data.success) {
                if (type === "user") setUsers((prev) => prev.filter((u) => u._id !== id));
                else setCompanies((prev) => prev.filter((c) => c._id !== id));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleReply = async (id, reply) => {
        try {
            const res = await axiosInstance.patch(`/admin/support/${id}/reply`, { reply });
            if (res.data.success) setTickets((prev) => prev.map((t) => (t._id === id ? res.data.ticket : t)));
        } catch (error) {
            alert(error.response?.data?.message || "Could not send reply");
        }
    };

    const handleCloseTicket = async (id) => {
        try {
            const res = await axiosInstance.patch(`/admin/support/${id}/close`);
            if (res.data.success) setTickets((prev) => prev.map((t) => (t._id === id ? res.data.ticket : t)));
        } catch (error) {
            alert(error.response?.data?.message || "Could not close ticket");
        }
    };

    const statCards = stats ? [
        { label: "Job Seekers", value: stats.totalStudents },
        { label: "Employers", value: stats.totalRecruiters },
        { label: "Total Jobs", value: stats.totalJobs },
        { label: "Pending Jobs", value: stats.pendingJobs },
        { label: "Approved Jobs", value: stats.approvedJobs },
        { label: "Companies", value: stats.totalCompanies },
        { label: "Applications", value: stats.totalApplications },
    ] : [];

    const filteredUsers = users.filter((u) => {
        const name = u.role === "recruiter" ? u.companyName : u.fullname;
        const q = searchTerm.toLowerCase();
        return [name, u.email, u.role, roleLabel(u.role)].some((v) => v?.toLowerCase().includes(q));
    });
    const jobSeekers = filteredUsers.filter((u) => u.role !== "recruiter");
    const employers = filteredUsers.filter((u) => u.role === "recruiter");
    const shownUsers = userRoleTab === "jobseekers" ? jobSeekers : employers;

    const filteredCompanies = companies.filter((c) => {
        const q = companySearch.toLowerCase();
        return [c.name, c.industry, c.location, c.userId?.email].some((v) => v?.toLowerCase().includes(q));
    });

    const contactTickets = tickets.filter((t) => t.kind === "contact");
    const reportTickets = tickets.filter((t) => t.kind === "report");
    const shownTickets = ticketKindTab === "contact" ? contactTickets : reportTickets;
    const openTicketCount = tickets.filter((t) => t.status === "open").length;

    const UserCard = ({ u }) => (
        <div className="border rounded-xl p-5 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{u.role === "recruiter" ? u.companyName : u.fullname}</h3>
                <button onClick={() => setConfirmTarget({ type: "user", id: u._id, name: u.role === "recruiter" ? u.companyName : u.fullname })} className="text-red-500 text-sm hover:underline">Delete</button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{u.email}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === "recruiter" ? "bg-[#8B5CF6]/15 text-[#8B5CF6]" : "bg-emerald-500/15 text-emerald-500"}`}>
                {roleLabel(u.role)}
            </span>
        </div>
    );

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            {confirmTarget && (
                <ConfirmModal target={confirmTarget} onCancel={() => setConfirmTarget(null)} onConfirm={confirmDelete} />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <Link to="/admin/pending-jobs" className="bg-[#8B5CF6] text-white px-4 py-2 rounded">Review Pending Jobs</Link>
            </div>

            <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
                {["overview", "users", "companies", "support"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-[#8B5CF6] text-[#8B5CF6]" : "border-transparent text-gray-500 dark:text-gray-400"}`}>
                        {tab}{tab === "support" && openTicketCount > 0 ? ` (${openTicketCount})` : ""}
                    </button>
                ))}
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {statCards.map((card) => (
                                <div key={card.label} className="border rounded-xl p-5 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div>
                            <input type="text" placeholder="Search by name, email, or role..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border p-2.5 rounded-lg mb-6 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white" />

                            <div className="relative flex w-full max-w-sm mx-auto bg-gray-100 dark:bg-[#1a1a1d] rounded-xl p-1 mb-6">
                                <div
                                    className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-transform duration-300 ease-out ${userRoleTab === "jobseekers" ? "bg-emerald-500" : "bg-[#8B5CF6]"}`}
                                    style={{ transform: userRoleTab === "employers" ? "translateX(100%)" : "translateX(0%)" }}
                                ></div>
                                <button onClick={() => setUserRoleTab("jobseekers")}
                                    className={`relative z-10 flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 ${userRoleTab === "jobseekers" ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                                    Job Seekers ({jobSeekers.length})
                                </button>
                                <button onClick={() => setUserRoleTab("employers")}
                                    className={`relative z-10 flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 ${userRoleTab === "employers" ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                                    Employers ({employers.length})
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {shownUsers.length === 0 ? (
                                    <p className="text-sm text-gray-500">No {userRoleTab === "jobseekers" ? "job seekers" : "employers"} found.</p>
                                ) : (
                                    shownUsers.map((u) => <UserCard key={u._id} u={u} />)
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "companies" && (
                        <div>
                            <input type="text" placeholder="Search by name, industry, location, or owner email..." value={companySearch}
                                onChange={(e) => setCompanySearch(e.target.value)}
                                className="w-full border p-2.5 rounded-lg mb-4 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredCompanies.length === 0 ? <p>No companies found.</p> : filteredCompanies.map((c) => (
                                    <div key={c._id} className="border rounded-xl p-5 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg">{c.name}</h3>
                                            <button onClick={() => setConfirmTarget({ type: "company", id: c._id, name: c.name })} className="text-red-500 text-sm hover:underline">Delete</button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            <Field label="Industry" value={c.industry} />
                                            <Field label="Location" value={c.location} />
                                            <Field label="Jobs" value={c.jobCount} />
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700 pt-2">
                                            Owner: {c.userId?.email || "—"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "support" && (
                        <div>
                            <div className="relative flex w-full max-w-sm mx-auto bg-gray-100 dark:bg-[#1a1a1d] rounded-xl p-1 mb-6">
                                <div
                                    className="absolute top-1 bottom-1 w-1/2 rounded-lg bg-[#8B5CF6] transition-transform duration-300 ease-out"
                                    style={{ transform: ticketKindTab === "report" ? "translateX(100%)" : "translateX(0%)" }}
                                ></div>
                                <button onClick={() => setTicketKindTab("contact")}
                                    className={`relative z-10 flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 ${ticketKindTab === "contact" ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                                    Messages ({contactTickets.length})
                                </button>
                                <button onClick={() => setTicketKindTab("report")}
                                    className={`relative z-10 flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 ${ticketKindTab === "report" ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                                    Reports ({reportTickets.length})
                                </button>
                            </div>

                            <div className="space-y-4">
                                {shownTickets.length === 0 ? (
                                    <p className="text-sm text-gray-500">No {ticketKindTab === "contact" ? "messages" : "reports"} yet.</p>
                                ) : (
                                    shownTickets.map((t) => <TicketCard key={t._id} t={t} onReply={handleReply} onClose={handleCloseTicket} />)
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;