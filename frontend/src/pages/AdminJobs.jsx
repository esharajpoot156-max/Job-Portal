import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const res = await axiosInstance.get("/job/getadminJobs");
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Posted Jobs</h1>
                <Link to="/admin/jobs/post" className="bg-[#8B5CF6] text-white px-4 py-2 rounded">
                    + Post New Job
                </Link>
            </div>

            <div className="space-y-4">
                {jobs.length === 0 ? (
                    <p>No jobs posted yet.</p>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className="border p-4 rounded flex justify-between items-center dark:border-gray-700">
                            <div>
                                <h3 className="font-semibold">{job.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} • {job.jobType}</p>
                            </div>
                            <Link to={`/admin/jobs/${job._id}/applicants`} className="text-[#8B5CF6] text-sm">
                                View Applicants
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminJobs;