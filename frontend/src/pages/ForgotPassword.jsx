import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/forgot-password", { email });
            if (res.data.success) {
                setSent(true);
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
                <h1 className="text-2xl font-bold mb-1 dark:text-white">Forgot Password</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Enter your email and we'll send you a reset link.
                </p>

                {sent ? (
                    <p className="text-sm text-[#8B5CF6] bg-[#8B5CF6]/10 p-4 rounded-xl">
                        A reset link has been sent to your email. Please check your inbox.
                    </p>
                ) : (
                    <form onSubmit={submitHandler}>
                        <input
                            type="email" placeholder="Email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-3 rounded-xl mb-5 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        />
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <p className="text-center mt-6 text-sm dark:text-gray-400">
                    <Link to="/login" className="text-[#8B5CF6] font-medium">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;