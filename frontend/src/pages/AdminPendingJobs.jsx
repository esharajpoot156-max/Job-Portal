import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AdminPendingJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPendingJobs = async () => {
        try {
            const res = await axiosInstance.get("/job/pending");
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPendingJobs();
    }, []);

    const statusHandler = async (jobId, status) => {
        try {
            setLoading(true);
            const res = await axiosInstance.patch(`/job/status/${jobId}`, { status });
            if (res.data.success) {
                alert(res.data.message);
                fetchPendingJobs();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Pending Job Approvals</h1>

            <div className="space-y-4">
                {jobs.length === 0 ? (
                    <p>No pending jobs.</p>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className="border p-4 rounded dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold">{job.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {job.company?.name} • {job.location} • Posted by {job.created_by?.fullname}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={loading}
                                        onClick={() => statusHandler(job._id, "approved")}
                                        className="bg-[#ACFFD2] text-gray-900 px-3 py-1.5 rounded text-sm"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => statusHandler(job._id, "rejected")}
                                        className="bg-red-500 text-white px-3 py-1.5 rounded text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{job.Description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPendingJobs;