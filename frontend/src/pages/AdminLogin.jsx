import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/authSlice";

const AdminLogin = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/login", { ...input, role: "admin" });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/admin/pending-jobs");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex">
            {/* Decorative panel */}
            <div className="hidden md:flex w-1/2 bg-[#121214] relative overflow-hidden items-center justify-center">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#8B5CF6] rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#ACFFD2] rounded-full opacity-20 blur-3xl"></div>

                <div className="relative z-10 text-center px-10">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Admin <span className="text-[#8B5CF6]">Panel</span>
                    </h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        Restricted access. Log in with your admin credentials to manage the platform.
                    </p>
                </div>

                <div className="absolute top-16 right-16 w-16 h-16 border-2 border-[#8B5CF6]/40 rounded-2xl rotate-12"></div>
                <div className="absolute bottom-24 left-16 w-10 h-10 bg-[#ACFFD2]/30 rounded-full"></div>
            </div>

            {/* Form panel */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-[#121214] px-6 sm:px-8 py-12 sm:py-16">
                <form onSubmit={submitHandler} className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1 dark:text-white">Admin Login</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Enter your admin credentials</p>

                    <input
                        type="email" name="email"
                        placeholder="Email"
                        value={input.email} onChange={changeHandler}
                        className="w-full border p-3 rounded-xl mb-4 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-colors"
                    />

                    <div className="relative mb-5">
                        <input
                            type={showPassword ? "text" : "password"} name="password"
                            placeholder="Password"
                            value={input.password} onChange={changeHandler}
                            className="w-full border p-3 pr-11 rounded-xl dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        />
                        <button
                            type="button" tabIndex={-1}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6]"
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;