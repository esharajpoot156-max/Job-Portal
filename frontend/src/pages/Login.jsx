import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/authSlice";

const Login = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "student";

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: initialRole
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [direction, setDirection] = useState("right");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const roleFromUrl = searchParams.get("role") === "recruiter" ? "recruiter" : "student";
        setInput((prev) => ({ ...prev, role: roleFromUrl }));
    }, [searchParams]);

    const changeHandler = (e) => {
        if (e.target.name === "role") {
            setDirection(e.target.value === "recruiter" ? "right" : "left");
        }
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/login", input);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const googleLoginHandler = () => {
        const googleAuthUrl = `${axiosInstance.defaults.baseURL}/user/google?role=${input.role}`;
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            googleAuthUrl,
            "Continue with Google",
            `width=${width},height=${height},left=${left},top=${top}`
        );
    };

    const isEmployer = input.role === "recruiter";
    const slideClass = direction === "right" ? "slide-in-right" : "slide-in-left";

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
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#8B5CF6] rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#ACFFD2] rounded-full opacity-20 blur-3xl"></div>

                <div key={input.role} className={`relative z-10 text-center px-10 ${slideClass}`}>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Welcome <span className="text-[#8B5CF6]">Back</span>
                    </h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        {isEmployer
                            ? "Log in to manage your job postings, review applicants, and find your next great hire."
                            : "Log in to continue your journey — find jobs, connect with recruiters, and grow your career."}
                    </p>
                </div>

                <div className="absolute top-16 right-16 w-16 h-16 border-2 border-[#8B5CF6]/40 rounded-2xl rotate-12"></div>
                <div className="absolute bottom-24 left-16 w-10 h-10 bg-[#ACFFD2]/30 rounded-full"></div>
            </div>

            {/* Form panel */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-[#121214] px-6 sm:px-8 py-12 sm:py-16">
                <form onSubmit={submitHandler} className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1 dark:text-white">Login</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Enter your details to continue</p>

                    {/* Sliding role toggle */}
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
                            type="email" name="email"
                            placeholder={isEmployer ? "Company Email" : "Email"}
                            value={input.email} onChange={changeHandler}
                            className="w-full border p-3 rounded-xl mb-4 dark:bg-[#1a1a1d] dark:border-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-colors"
                        />

                        <div className="relative mb-2">
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

                        <div className="text-right mb-5">
                            <Link to="/forgot-password" className="text-sm text-[#8B5CF6]">Forgot Password?</Link>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#8B5CF6] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : isEmployer ? "Login" : "Login"}
                    </button>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                   

                    <p className="text-center mt-6 text-sm dark:text-gray-400">
                        Don't have an account?{" "}
                        {isEmployer ? (
                            <Link to="/register?role=recruiter" className="text-[#8B5CF6] font-medium">
                                Register as Employer
                            </Link>
                        ) : (
                            <Link to="/register?role=student" className="text-[#8B5CF6] font-medium">
                                Create an account
                            </Link>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;