import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Applicants = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchApplicants = async () => {
        try {
            const res = await axiosInstance.get(`/application/${id}/applicants`);
            if (res.data.success) {
                setJob(res.data.job);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    const statusHandler = async (applicationId, status) => {
        try {
            setLoading(true);
            const res = await axiosInstance.post(`/application/status/${applicationId}/update`, { status });
            if (res.data.success) {
                alert(res.data.message);
                fetchApplicants();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!job) return <p className="p-8 dark:text-white">Loading...</p>;

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Applicants for {job.title}</h1>

            <div className="space-y-4">
                {job.applications?.length === 0 ? (
                    <p>No applicants yet.</p>
                ) : (
                    job.applications?.map((app) => (
                        <div key={app._id} className="border p-5 rounded dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-lg">{app.applicant?.fullname}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.email}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.phoneNumber}</p>
                                    <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded mt-2 inline-block">
                                        {app.status}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        disabled={loading || app.status !== "pending"}
                                        onClick={() => statusHandler(app._id, "accepted")}
                                        className="bg-[#ACFFD2] text-gray-900 px-3 py-1.5 rounded text-sm disabled:opacity-50"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        disabled={loading || app.status !== "pending"}
                                        onClick={() => statusHandler(app._id, "rejected")}
                                        className="bg-red-500 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {app.applicant?.profile?.bio ? (
                                <div className="mb-2">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Bio</p>
                                    <p className="text-sm">{app.applicant.profile.bio}</p>
                                </div>
                            ) : null}

                            {app.applicant?.profile?.skills?.length > 0 ? (
                                <div className="mb-2">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {app.applicant.profile.skills.map((skill, idx) => (
                                            <span key={idx} className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {app.applicant?.profile?.resume ? (
                                <a href={app.applicant.profile.resume} target="_blank" rel="noreferrer" className="text-sm text-[#8B5CF6] mt-2 inline-block">
                                    View Resume
                                </a>
                            ) : null}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Applicants;