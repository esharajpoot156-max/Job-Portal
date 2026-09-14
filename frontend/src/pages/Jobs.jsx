import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import JobCard from "../components/JobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";

const inputCls = "border p-2.5 rounded-lg flex-1 min-w-[120px] dark:bg-[#1a1a1d] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]";

const Jobs = () => {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/job/get", {
                params: { keyword, location, minSalary, maxSalary },
            });
            if (res.data.success) setJobs(res.data.jobs);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const searchHandler = (e) => { e.preventDefault(); fetchJobs(); };
    const clearFilters = () => { setMinSalary(""); setMaxSalary(""); };

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214] relative">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#8B5CF6] opacity-20 rounded-full blur-3xl animate-blob pointer-events-none z-0"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-[#ACFFD2] opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none z-0"></div>

            <div className="relative z-10 bg-[#F4F4F5] dark:bg-[#1a1a1d] border-b dark:border-gray-700 px-8 py-8">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Find Your Next Job</h1>
                <form onSubmit={searchHandler} className="flex flex-col gap-3 max-w-3xl">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input type="text" placeholder="Job title or keyword..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className={inputCls} />
                        <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
                        <button type="submit" className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">Search</button>
                        <button type="button" onClick={() => setShowFilters(p => !p)} className="border-2 border-[#8B5CF6] text-[#8B5CF6] px-6 py-2.5 rounded-lg font-medium hover:bg-[#8B5CF6] hover:text-white transition-colors">
                            {showFilters ? "Hide Filters" : "Filters"}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="flex flex-wrap gap-3 bg-white dark:bg-[#121214] border dark:border-gray-700 rounded-lg p-4">
                            <input type="number" min="0" placeholder="Min Salary" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} className={inputCls} />
                            <input type="number" min="0" placeholder="Max Salary" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} className={inputCls} />
                            <button type="button" onClick={clearFilters} className="text-sm text-gray-500 dark:text-gray-400 hover:underline px-2 shrink-0">Clear</button>
                        </div>
                    )}
                </form>
            </div>

            <div className="relative z-10 px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, idx) => <JobCardSkeleton key={idx} />)}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-gray-500 dark:text-gray-400">No jobs found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
