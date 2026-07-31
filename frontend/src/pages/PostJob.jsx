import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const PostJob = () => {
    const [companies, setCompanies] = useState([]);
    const [input, setInput] = useState({
        title: "",
        Description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCompanies = async () => {
        try {
            const res = await axiosInstance.get("/company/get");
            if (res.data.success) {
                setCompanies(res.data.companies);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/job/post", input);
            if (res.data.success) {
                alert(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

            <form onSubmit={submitHandler} className="space-y-4">
                <input type="text" name="title" placeholder="Job Title" value={input.title} onChange={changeHandler}
                    className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />

                <textarea name="Description" placeholder="Job Description" value={input.Description} onChange={changeHandler}
                    className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" rows={4} />

                <input type="text" name="requirements" placeholder="Requirements (comma separated)" value={input.requirements} onChange={changeHandler}
                    className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />

                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="salary" placeholder="Salary" value={input.salary} onChange={changeHandler}
                        className="border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />
                    <input type="text" name="location" placeholder="Location" value={input.location} onChange={changeHandler}
                        className="border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <input type="text" name="jobType" placeholder="Job Type" value={input.jobType} onChange={changeHandler}
                        className="border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />
                    <input type="number" name="experience" placeholder="Experience (yrs)" value={input.experience} onChange={changeHandler}
                        className="border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />
                    <input type="number" name="position" placeholder="Positions" value={input.position} onChange={changeHandler}
                        className="border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />
                </div>

                <select name="companyId" value={input.companyId} onChange={changeHandler}
                    className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700">
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>

                <button type="submit" disabled={loading} className="w-full bg-[#8B5CF6] text-white py-2 rounded">
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>
        </div>
    );
};

export default PostJob;