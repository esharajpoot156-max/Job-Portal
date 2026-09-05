import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [userRoleTab, setUserRoleTab] = useState("jobseekers");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [companySearch, setCompanySearch] = useState("");
    const [confirmTarget, setConfirmTarget] = useState(null); // { type: "user"|"company", id, name }

    useEffect(() => {
        (async () => {
            try {
                const [s, u, c] = await Promise.all([
                    axiosInstance.get("/admin/stats"),
                    axiosInstance.get("/admin/users"),
                    axiosInstance.get("/admin/companies"),
                ]);
                if (s.data.success) setStats(s.data.stats);
                if (u.data.success) setUsers(u.data.users);
                if (c.data.success) setCompanies(c.data.companies);
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
                {["overview", "users", "companies"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-[#8B5CF6] text-[#8B5CF6]" : "border-transparent text-gray-500 dark:text-gray-400"}`}>
                        {tab}
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
                </>
            )}
        </div>
    );
};

export default AdminDashboard;