import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const MyPostedJob = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
        
            const res = await axiosInstance.get("/job/getadminjobs");
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
        fetchMyJobs();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Posted Jobs</h1>
                <button
                    onClick={() => navigate("/admin/jobs/post")}
                    className="bg-[#8B5CF6] text-white px-4 py-2 rounded"
                >
                    + Post New Job
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    You haven't posted any jobs yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="border rounded-lg p-4 flex justify-between items-start dark:border-gray-700 dark:bg-[#1a1a1d]"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{job.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {job.company?.name} • {job.location}
                                </p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                        {job.jobType}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                        {job.experience} yrs exp
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                        {job.position} position{job.position > 1 ? "s" : ""}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                        ${job.salary}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                <button
                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                    className="text-sm px-3 py-1 rounded border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition"
                                >
                                    View Applicants
                                </button>
                                <span className="text-xs text-gray-400">
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPostedJob;