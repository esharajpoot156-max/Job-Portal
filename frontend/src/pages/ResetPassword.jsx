import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post(`/user/reset-password/${token}`, { newPassword });
            if (res.data.success) {
                alert(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-white dark:bg-[#121214] px-8">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-1 dark:text-white">Reset Password</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Enter your new password below.</p>

                <form onSubmit={submitHandler}>
                    <input
                        type="password" placeholder="New Password"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border p-3 rounded-xl mb-5 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm dark:text-gray-400">
                    <Link to="/login" className="text-[#8B5CF6] font-medium">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;