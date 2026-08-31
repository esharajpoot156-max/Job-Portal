import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const badge = { pending: "bg-gray-200 text-gray-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };

const Applicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [busy, setBusy] = useState(null);

    const fetchApplicants = async () => {
        const res = await axiosInstance.get(`/application/${id}/applicants`);
        if (res.data.success) setJob(res.data.job);
    };

    useEffect(() => { fetchApplicants(); }, [id]);

    const updateStatus = async (appId, status) => {
        try {
            setBusy(appId);
            const res = await axiosInstance.post(`/application/status/${appId}/update`, { status });
            if (res.data.success)
                setJob(prev => ({ ...prev, applications: prev.applications.map(a => a._id === appId ? { ...a, status } : a) }));
        } catch (e) {
            alert(e.response?.data?.message || "Something went wrong");
        } finally { setBusy(null); }
    };

    if (!job) return <p className="p-8 dark:text-white">Loading...</p>;

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Applicants for {job.title}</h1>
            <div className="space-y-4">
                {!job.applications?.length ? <p>No applicants yet.</p> : job.applications.map(app => {
                    const p = app.applicant?.profile || {};
                    return (
                        <div key={app._id} className="border p-5 rounded dark:border-gray-700">
                            <div className="flex justify-between items-start flex-wrap gap-3">
                                <div>
                                    <h3 className="font-semibold text-lg">{app.applicant?.fullname}</h3>
                                    <p className="text-sm text-gray-500">{app.applicant?.email} • {app.applicant?.phoneNumber}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                        {p.city && <span>📍 {p.city}</span>}
                                        {p.qualification && <span>🎓 {p.qualification}</span>}
                                        {p.experience && <span>💼 Experience: {p.experience}</span>}
                                        {p.jobPreference && <span>🕒 Preference: {p.jobPreference}</span>}
                                        {p.salaryExpectation && <span>💰 Expected Salary: {p.salaryExpectation}</span>}
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block capitalize ${badge[app.status]}`}>{app.status}</span>
                                </div>
                                {app.status === "pending" ? (
                                    <div className="flex gap-2">
                                        <button disabled={busy === app._id} onClick={() => updateStatus(app._id, "accepted")} className="bg-[#ACFFD2] text-gray-900 px-3 py-1.5 rounded text-sm disabled:opacity-50">Accept</button>
                                        <button disabled={busy === app._id} onClick={() => updateStatus(app._id, "rejected")} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50">Reject</button>
                                    </div>
                                ) : (
                                    <span className={`text-sm font-medium ${app.status === "accepted" ? "text-green-600" : "text-red-500"}`}>
                                        {app.status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
                                    </span>
                                )}
                            </div>
                            {p.bio && <p className="text-sm mt-2"><span className="text-xs text-gray-500 block">Bio</span>{p.bio}</p>}
                            {p.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {p.skills.map((s, i) => <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{s}</span>)}
                                </div>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                                {p.resume && <a href={p.resume} target="_blank" rel="noreferrer" className="text-sm text-[#8B5CF6]">View Resume</a>}
                                <button onClick={() => navigate(`/chat/${app.applicant?._id}`)} className="text-sm text-[#8B5CF6] border border-[#8B5CF6] px-3 py-1 rounded">Message</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Applicants;