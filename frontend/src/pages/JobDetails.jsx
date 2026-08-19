import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useSelector((store) => store.auth);
    const [job, setJob] = useState(null);
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/job/get/${id}`).then((res) => {
            if (res.data.success) setJob(res.data.job);
        }).catch(console.log);
    }, [id]);

    useEffect(() => {
        setSaved(!!user?.savedJobs?.includes(id));
    }, [user, id]);

    useEffect(() => {
        if (!job || !user) return;
        setApplied(job.applications?.some(a => (a?.applicant?._id || a?.applicant || a) === user._id));
    }, [job, user]);

    const applyHandler = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/application/apply/${id}`);
            if (res.data.success) {
                alert(res.data.message);
                setApplied(true);
                setJob(prev => prev && { ...prev, applications: [...(prev.applications || []), { applicant: user._id }] });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const saveHandler = async () => {
        if (!user) return;
        const prevSaved = saved;
        setSaved(!prevSaved);
        setSaving(true);
        try {
            const res = await axiosInstance.post(`/user/save-job/${id}`);
            if (!res.data.success) setSaved(prevSaved);
        } catch (error) {
            setSaved(prevSaved);
            alert(error.response?.data?.message || "Could not save job");
        } finally {
            setSaving(false);
        }
    };

    if (!job) {
        return (
            <div className="p-8 min-h-screen bg-white dark:bg-[#121214]">
                <div className="max-w-4xl mx-auto animate-pulse space-y-4">
                    <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#ACFFD2]/10 dark:from-[#8B5CF6]/10 dark:to-[#ACFFD2]/5 border-b dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-8 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        {job.company?.logo ? (
                            <img src={job.company.logo} alt={job.company.name} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                {job.company?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white">{job.title}</h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {job.company?.name} • 📍 {job.location}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-white dark:bg-[#1a1a1d] border dark:border-gray-700 px-3 py-1.5 rounded-full font-medium dark:text-gray-200">{job.jobType}</span>
                        <span className="text-xs bg-white dark:bg-[#1a1a1d] border dark:border-gray-700 px-3 py-1.5 rounded-full font-medium dark:text-gray-200">👥 {job.position} positions</span>
                        <span className="text-xs bg-white dark:bg-[#1a1a1d] border dark:border-gray-700 px-3 py-1.5 rounded-full font-medium dark:text-gray-200">🧑‍💼 {job.experienceLevel} yrs experience</span>
                        <span className="text-xs bg-[#ACFFD2] px-3 py-1.5 rounded-full text-gray-900 font-semibold">💰 Rs {job.salary}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h2 className="font-semibold text-lg mb-3 dark:text-white">Job Description</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.Description}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg mb-3 dark:text-white">Requirements</h2>
                        <ul className="space-y-2">
                            {job.requirements?.map((req, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="md:sticky md:top-6 md:self-start bg-[#F4F4F5] dark:bg-[#1a1a1d] rounded-2xl p-6 space-y-3">
                    <h3 className="font-semibold dark:text-white mb-1">Interested in this role?</h3>

                    {user?.role === "student" && (
                        <>
                            <button
                                onClick={applyHandler}
                                disabled={applied || loading}
                                className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                            >
                                {applied ? "✓ Applied" : loading ? "Applying..." : "Apply Now"}
                            </button>

                            <button
                                onClick={saveHandler}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 border-2 border-[#8B5CF6] text-[#8B5CF6] py-3 rounded-xl font-medium hover:bg-[#8B5CF6] hover:text-white transition-colors disabled:opacity-50"
                            >
                                <Bookmark size={16} className={saved ? "fill-current" : "fill-transparent"} />
                                {saved ? "Saved" : "Save Job"}
                            </button>

                            <Link to={`/chat/${job.created_by}`} className="block text-center w-full border-2 border-[#8B5CF6] text-[#8B5CF6] py-3 rounded-xl font-medium hover:bg-[#8B5CF6] hover:text-white transition-colors">
                                Message Recruiter
                            </Link>
                        </>
                    )}

                    {!user && (
                        <Link to="/login" className="block text-center w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium">
                            Login to Apply
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
