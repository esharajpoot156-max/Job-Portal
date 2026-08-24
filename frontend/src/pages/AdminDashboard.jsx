import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get("/admin/stats");
            if (res.data.success) setStats(res.data.stats);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/admin/users");
            if (res.data.success) setUsers(res.data.users);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const res = await axiosInstance.get("/admin/companies");
            if (res.data.success) setCompanies(res.data.companies);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUserHandler = async (id) => {
        if (!window.confirm("Delete this user permanently?")) return;
        try {
            const res = await axiosInstance.delete(`/admin/users/${id}`);
            if (res.data.success) {
                setUsers((prev) => prev.filter((u) => u._id !== id));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchUsers(), fetchCompanies()]);
            setLoading(false);
        };
        loadAll();
    }, []);

    const statCards = stats ? [
        { label: "Students", value: stats.totalStudents },
        { label: "Recruiters", value: stats.totalRecruiters },
        { label: "Total Jobs", value: stats.totalJobs },
        { label: "Pending Jobs", value: stats.pendingJobs },
        { label: "Approved Jobs", value: stats.approvedJobs },
        { label: "Companies", value: stats.totalCompanies },
        { label: "Applications", value: stats.totalApplications },
    ] : [];

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <Link to="/admin/pending-jobs" className="bg-[#8B5CF6] text-white px-4 py-2 rounded">
                    Review Pending Jobs
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
                {["overview", "users", "companies"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab
                                ? "border-[#8B5CF6] text-[#8B5CF6]"
                                : "border-transparent text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {statCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="border rounded-xl p-5 dark:border-gray-700"
                                >
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-3">
                            {users.length === 0 ? (
                                <p>No users found.</p>
                            ) : (
                                users.map((u) => (
                                    <div
                                        key={u._id}
                                        className="border p-4 rounded flex justify-between items-center dark:border-gray-700"
                                    >
                                        <div>
                                            <h3 className="font-semibold">
                                                {u.role === "recruiter" ? u.companyName : u.fullname}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {u.email} • {u.role}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteUserHandler(u._id)}
                                            className="text-red-500 text-sm hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "companies" && (
                        <div className="space-y-3">
                            {companies.length === 0 ? (
                                <p>No companies found.</p>
                            ) : (
                                companies.map((c) => (
                                    <div
                                        key={c._id}
                                        className="border p-4 rounded dark:border-gray-700"
                                    >
                                        <h3 className="font-semibold">{c.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {c.industry || "No industry set"} • {c.location || "No location set"}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;