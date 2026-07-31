import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import JobCard from "../components/JobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/job/get", {
                params: { keyword, location }
            });
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const searchHandler = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            {/* Search bar */}
            <div className="bg-[#F4F4F5] dark:bg-[#1a1a1d] border-b dark:border-gray-700 px-8 py-8">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Find Your Next Job</h1>
                <form onSubmit={searchHandler} className="flex flex-col sm:flex-row gap-3 max-w-3xl">
                    <input
                        type="text"
                        placeholder="Job title or keyword..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="border p-2.5 rounded-lg flex-1 dark:bg-[#121214] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                    <input
                        type="text"
                        placeholder="Location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2.5 rounded-lg flex-1 dark:bg-[#121214] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                    <button
                        type="submit"
                        className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, idx) => (
                            <JobCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-gray-500 dark:text-gray-400">No jobs found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;