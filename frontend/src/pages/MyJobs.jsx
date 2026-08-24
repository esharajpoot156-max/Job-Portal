import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const statusStyles = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    accepted: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const MyJobs = () => {
    const [tab, setTab] = useState("saved");
    const [savedJobs, setSavedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [savedRes, appliedRes] = await Promise.all([
                    axiosInstance.get("/user/saved-jobs"),
                    axiosInstance.get("/application/get"),
                ]);
                if (savedRes.data.success) setSavedJobs(savedRes.data.savedJobs);
                if (appliedRes.data.success) setAppliedJobs(appliedRes.data.applications);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const applications = tab === "applied" ? appliedJobs : null;
    const jobs = tab === "saved" ? savedJobs : appliedJobs.map((app) => app.job);

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#8B5CF6]/10 via-[#8B5CF6]/5 to-[#ACFFD2]/10 dark:from-[#8B5CF6]/10 dark:via-[#1a1a1d] dark:to-[#ACFFD2]/5 border-b dark:border-gray-800">
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-[#8B5CF6]/10 rounded-full blur-3xl" />
                <div className="max-w-4xl mx-auto px-8 py-12 relative">
                    <h1 className="text-3xl font-bold dark:text-white mb-1">My Jobs</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-7">Track what you've saved and applied to, all in one place.</p>

                    <div className="inline-flex bg-white/70 dark:bg-[#1a1a1d]/70 backdrop-blur border dark:border-gray-700 rounded-2xl p-1 gap-1">
                        <button
                            onClick={() => setTab("saved")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                tab === "saved"
                                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#242427]"
                            }`}
                        >
                            <Bookmark size={16} className={tab === "saved" ? "fill-current" : "fill-transparent"} />
                            Saved
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "saved" ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}>
                                {savedJobs.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setTab("applied")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                tab === "applied"
                                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#242427]"
                            }`}
                        >
                            <Briefcase size={16} />
                            Applied
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "applied" ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}>
                                {appliedJobs.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-8 py-10">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 w-full bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-4">
                            {tab === "saved" ? (
                                <Bookmark size={26} className="text-[#8B5CF6]" />
                            ) : (
                                <Briefcase size={26} className="text-[#8B5CF6]" />
                            )}
                        </div>
                        <h3 className="font-semibold dark:text-white mb-1">
                            {tab === "saved" ? "No saved jobs yet" : "No applications yet"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                            {tab === "saved"
                                ? "Bookmark roles you're interested in and they'll show up here."
                                : "Jobs you apply to will show up here so you can track your progress."}
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-5 inline-flex items-center gap-1.5 text-[#8B5CF6] font-medium text-sm hover:gap-2.5 transition-all"
                        >
                            Browse jobs <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job, idx) => (
                            <Link
                                key={job._id}
                                to={`/jobs/${job._id}`}
                                className="group flex items-center gap-5 bg-[#F4F4F5] dark:bg-[#1a1a1d] rounded-2xl p-5 border border-transparent hover:border-[#8B5CF6]/50 hover:shadow-lg hover:shadow-[#8B5CF6]/5 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {job.company?.logo ? (
                                    <img
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        className="w-14 h-14 rounded-xl object-cover shadow-md shrink-0"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                                        {job.company?.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="font-semibold dark:text-white group-hover:text-[#8B5CF6] transition-colors truncate">
                                            {job.title}
                                        </h2>
                                        {applications && (
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${statusStyles[applications[idx]?.status] || statusStyles.pending}`}>
                                                {applications[idx]?.status || "pending"}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{job.company?.name}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2.5">
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <MapPin size={12} /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Clock size={12} /> {job.jobType}
                                        </span>
                                        <span className="text-xs bg-[#ACFFD2] px-2.5 py-0.5 rounded-full text-gray-900 font-semibold">
                                            💰 Rs {job.salary}
                                        </span>
                                    </div>
                                </div>

                                <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all shrink-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyJobs;