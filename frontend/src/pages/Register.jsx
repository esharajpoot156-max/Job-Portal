import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "student";

    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: initialRole
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [direction, setDirection] = useState("right");
    const navigate = useNavigate();

    useEffect(() => {
        const roleFromUrl = searchParams.get("role") === "recruiter" ? "recruiter" : "student";
        setInput((prev) => ({ ...prev, role: roleFromUrl }));
    }, [searchParams]);

    const isEmployer = input.role === "recruiter";
    const slideClass = direction === "right" ? "slide-in-right" : "slide-in-left";
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    const changeHandler = (e) => {
        if (e.target.name === "role") {
            setDirection(e.target.value === "recruiter" ? "right" : "left");
        }
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.name || !input.email || !input.password || !input.confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (!strongPasswordRegex.test(input.password)) {
            alert("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }
        if (input.password !== input.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                [isEmployer ? "companyName" : "fullname"]: input.name,
                email: input.email,
                password: input.password,
                role: input.role
            };
            const res = await axiosInstance.post("/user/register", payload);
            if (res.data.success) {
                alert(res.data.message);
                navigate(`/login?role=${input.role}`);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex">
            <style>{`
                @keyframes slideInRight { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInLeft { from { transform: translateX(-24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .slide-in-right { animation: slideInRight 0.3s ease-out; }
                .slide-in-left { animation: slideInLeft 0.3s ease-out; }
            `}</style>

            {/* Decorative panel */}
            <div className="hidden md:flex w-1/2 bg-[#121214] relative overflow-hidden items-center justify-center">
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#ACFFD2] rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-0 left-0 w-80 h-80 bg-[#8B5CF6] rounded-full opacity-30 blur-3xl"></div>

                <div key={input.role} className={`relative z-10 text-center px-10 ${slideClass}`}>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Join <span className="text-[#8B5CF6]">Job Portal</span>
                    </h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        {isEmployer
                            ? "Create a company account to post jobs and find the right talent for your team."
                            : "Create an account to start applying for jobs and connect with recruiters."}
                    </p>
                </div>

                <div className="absolute bottom-16 left-16 w-16 h-16 border-2 border-[#ACFFD2]/40 rounded-2xl -rotate-12"></div>
                <div className="absolute top-24 right-16 w-10 h-10 bg-[#8B5CF6]/30 rounded-full"></div>
            </div>

            {/* Form panel */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-[#121214] px-6 sm:px-8 py-12">
                <form onSubmit={submitHandler} className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1 dark:text-white">Create Account</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Fill in your details to get started</p>

                    {/* Sliding effect*/}
                    <div className="relative flex bg-gray-100 dark:bg-[#1a1a1d] rounded-xl p-1 mb-6">
                        <div
                            className="absolute top-1 bottom-1 w-1/2 bg-[#8B5CF6] rounded-lg transition-transform duration-300 ease-out"
                            style={{ transform: isEmployer ? "translateX(100%)" : "translateX(0%)" }}
                        ></div>
                        <label className={`relative z-10 flex-1 text-center py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-300 ${!isEmployer ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                            <input type="radio" name="role" value="student" checked={input.role === "student"} onChange={changeHandler} className="sr-only" />
                            Job Seeker
                        </label>
                        <label className={`relative z-10 flex-1 text-center py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-300 ${isEmployer ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                            <input type="radio" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeHandler} className="sr-only" />
                            Employer
                        </label>
                    </div>

                    <div key={input.role} className={slideClass}>
                        <input
                            type="text" name="name" required
                            placeholder={isEmployer ? "Company Name *" : "Full Name *"}
                            value={input.name} onChange={changeHandler}
                            className="w-full border p-3 rounded-xl mb-3 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        />
                        <input
                            type="email" name="email" required
                            placeholder={isEmployer ? "Company Email *" : "Email *"}
                            value={input.email} onChange={changeHandler}
                            className="w-full border p-3 rounded-xl mb-3 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        />

                        <div className="relative mb-3">
                            <input
                                type={showPassword ? "text" : "password"} name="password" required
                                placeholder="Password *"
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

                        <div className="relative mb-1">
                            <input
                                type={showConfirm ? "text" : "password"} name="confirmPassword" required
                                placeholder="Confirm Password *"
                                value={input.confirmPassword} onChange={changeHandler}
                                className="w-full border p-3 pr-11 rounded-xl dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                            />
                            <button
                                type="button" tabIndex={-1}
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6]"
                            >
                                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                            Min 8 characters, with uppercase, lowercase, number & special character.
                        </p>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : isEmployer ? "Register" : "Register"}
                    </button>

                    <p className="text-center mt-6 text-sm dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to={`/login?role=${input.role}`} className="text-[#8B5CF6] font-medium">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;s
