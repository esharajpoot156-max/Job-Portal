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
                        <div key={app._id} className="border p-4 rounded flex justify-between items-center dark:border-gray-700">
                            <div>
                                <h3 className="font-semibold">{app.applicant?.fullname}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.email}</p>
                                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded mt-1 inline-block">
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    disabled={loading}
                                    onClick={() => statusHandler(app._id, "accepted")}
                                    className="bg-[#ACFFD2] text-gray-900 px-3 py-1.5 rounded text-sm"
                                >
                                    Accept
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={() => statusHandler(app._id, "rejected")}
                                    className="bg-red-500 text-white px-3 py-1.5 rounded text-sm"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Applicants;