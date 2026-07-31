import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student"
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/register", input);
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
        <div className="min-h-[calc(100vh-73px)] flex">
            {/* Decorative panel */}
            <div className="hidden md:flex w-1/2 bg-[#121214] relative overflow-hidden items-center justify-center">
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#ACFFD2] rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-0 left-0 w-80 h-80 bg-[#8B5CF6] rounded-full opacity-30 blur-3xl"></div>

                <div className="relative z-10 text-center px-10">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Join <span className="text-[#8B5CF6]">Job Portal</span>
                    </h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        Create an account to start applying for jobs or find the right talent for your team.
                    </p>
                </div>

                <div className="absolute bottom-16 left-16 w-16 h-16 border-2 border-[#ACFFD2]/40 rounded-2xl -rotate-12"></div>
                <div className="absolute top-24 right-16 w-10 h-10 bg-[#8B5CF6]/30 rounded-full"></div>
            </div>

            {/* Form panel */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-[#121214] px-8 py-12">
                <form onSubmit={submitHandler} className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1 dark:text-white">Create Account</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Fill in your details to get started</p>

                    <input
                        type="text" name="fullname" placeholder="Full Name"
                        value={input.fullname} onChange={changeHandler}
                        className="w-full border p-3 rounded-xl mb-3 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                    <input
                        type="email" name="email" placeholder="Email"
                        value={input.email} onChange={changeHandler}
                        className="w-full border p-3 rounded-xl mb-3 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                    <input
                        type="text" name="phoneNumber" placeholder="Phone Number"
                        value={input.phoneNumber} onChange={changeHandler}
                        className="w-full border p-3 rounded-xl mb-3 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                    <input
                        type="password" name="password" placeholder="Password"
                        value={input.password} onChange={changeHandler}
                        className="w-full border p-3 rounded-xl mb-4 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />

                    <div className="flex gap-4 mb-6">
                        <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                            <input type="radio" name="role" value="student" checked={input.role === "student"} onChange={changeHandler} className="accent-[#8B5CF6]" />
                            Student
                        </label>
                        <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                            <input type="radio" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeHandler} className="accent-[#8B5CF6]" />
                            Recruiter
                        </label>
                        <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                            <input type="radio" name="role" value="admin" checked={input.role === "admin"} onChange={changeHandler} className="accent-[#8B5CF6]" />
                            Admin
                        </label>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : "Register"}
                    </button>

                    <p className="text-center mt-6 text-sm dark:text-gray-400">
                        Already have an account? <Link to="/login" className="text-[#8B5CF6] font-medium">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;