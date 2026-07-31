import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import JobCard from "../components/JobCard";

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
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214]">
            <form onSubmit={searchHandler} className="flex gap-3 mb-8">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border p-2 rounded flex-1 dark:bg-[#1a1a1d] dark:text-white dark:border-gray-700"
                />
                <input
                    type="text"
                    placeholder="Location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-2 rounded flex-1 dark:bg-[#1a1a1d] dark:text-white dark:border-gray-700"
                />
                <button type="submit" className="bg-[#8B5CF6] text-white px-6 rounded">
                    Search
                </button>
            </form>

            {loading ? (
                <p className="dark:text-white">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length === 0 ? (
                        <p className="dark:text-white">No jobs found.</p>
                    ) : (
                        jobs.map((job) => <JobCard key={job._id} job={job} />)
                    )}
                </div>
            )}
        </div>
    );
};

export default Jobs;