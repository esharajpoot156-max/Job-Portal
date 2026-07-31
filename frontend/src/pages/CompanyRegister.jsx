import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const CompanyRegister = () => {
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/company/register", { companyName });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/admin/jobs/post");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Register Your Company</h1>

            <form onSubmit={submitHandler} className="space-y-4">
                <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#8B5CF6] text-white py-2 rounded"
                >
                    {loading ? "Registering..." : "Register Company"}
                </button>
            </form>
        </div>
    );
};

export default CompanyRegister;