import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useSelector((store) => store.auth);
    const [job, setJob] = useState(null);
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchJob = async () => {
        try {
            const res = await axiosInstance.get(`/job/get/${id}`);
            if (res.data.success) {
                setJob(res.data.job);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    const applyHandler = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/application/apply/${id}`);
            if (res.data.success) {
                alert(res.data.message);
                setApplied(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!job) return <p className="p-8 dark:text-white">Loading...</p>;

    return (
        <div className="p-8 max-w-3xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <div className="flex items-center gap-4 mb-6">
                {job.company?.logo && (
                    <img src={job.company.logo} alt={job.company.name} className="w-14 h-14 rounded object-cover" />
                )}
                <div>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{job.company?.name} • {job.location}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded">{job.jobType}</span>
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded">{job.position} positions</span>
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded">Experience: {job.experienceLevel} yrs</span>
                <span className="text-xs bg-[#ACFFD2] px-3 py-1 rounded text-gray-900">₨ {job.salary}</span>
            </div>

            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{job.Description}</p>

            <h2 className="font-semibold mb-2">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
                {job.requirements?.map((req, idx) => (
                    <li key={idx}>{req}</li>
                ))}
            </ul>

            {user?.role === "student" && (
                <button
                    onClick={applyHandler}
                    disabled={applied || loading}
                    className="bg-[#8B5CF6] text-white px-6 py-2 rounded disabled:opacity-50"
                >
                    {applied ? "Applied" : loading ? "Applying..." : "Apply Now"}
                </button>
            )}
            {user && user.role === "student" && (
                <Link
                to={`/chat/${job.created_by}`}
                className="ml-3 border border-[#8B5CF6] text-[#8B5CF6] px-6 py-2 rounded inline-block">
                    Message Recruiter
                    </Link>
            )}
        </div>
    );
};

export default JobDetails;