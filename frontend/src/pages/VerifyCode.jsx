import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const VerifyCode = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!code) {
            alert("Please enter the verification code");
            return;
        }
        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/verify-email", { email, code });
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

    const resendHandler = async () => {
        try {
            setResending(true);
            const res = await axiosInstance.post("/user/resend-verification", { email });
            alert(res.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-white dark:bg-[#121214] px-6">
            <form onSubmit={submitHandler} className="w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-1 dark:text-white">Verify your email</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Enter the 6-digit code sent to <span className="font-medium">{email}</span>
                </p>

                <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full border p-3 rounded-xl mb-4 text-center text-lg tracking-widest dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <p className="text-center mt-6 text-sm dark:text-gray-400">
                    Didn't get the code?{" "}
                    <button type="button" onClick={resendHandler} disabled={resending} className="text-[#8B5CF6] font-medium">
                        {resending ? "Sending..." : "Resend"}
                    </button>
                </p>

                <p className="text-center mt-3 text-sm dark:text-gray-400">
                    <Link to="/login" className="text-[#8B5CF6] font-medium">Back to Login</Link>
                </p>
            </form>
        </div>
    );
};

export default VerifyCode;