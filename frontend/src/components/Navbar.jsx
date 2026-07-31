import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { logoutUser } from "../redux/authSlice";
import { useTheme } from "../utils/ThemeContext";

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { darkMode, setDarkMode } = useTheme();

    const logoutHandler = async () => {
        try {
            await axiosInstance.get("/user/logout");
            dispatch(logoutUser());
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-white dark:bg-[#121214] dark:text-white">
            <Link to="/" className="text-xl font-bold text-[#8B5CF6]">JobEase</Link>

            <div className="flex items-center gap-6">
                {user && (
                    <Link to="/jobs" className="text-sm">Jobs</Link>
                )}

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600"
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>

                {user ? (
                    <>
                        {user.role === "student" && (
                            <Link to="/messages" className="text-sm">Messages</Link>
                        )}
                        {user.role === "recruiter" && (
                            <Link to="/admin/jobs" className="text-sm">My Jobs</Link>
                        )}

                        <Link to="/notifications" className="text-sm relative">
                            🔔
                        </Link>
                        
                        {user && (
                            <Link to="/profile" className="text-sm">Profile</Link>
                        )}

                        <span className="text-sm">Hi, {user.fullname}</span>
                        <button onClick={logoutHandler} className="bg-red-500 text-white px-4 py-1.5 rounded">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm">Login</Link>
                        <Link to="/register" className="bg-[#8B5CF6] text-white px-4 py-1.5 rounded text-sm">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;