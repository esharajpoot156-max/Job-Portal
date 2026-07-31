import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/authSlice";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student"
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (e) => {
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={submitHandler} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-gray-900">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <input
                    type="email" name="email" placeholder="Email"
                    value={input.email} onChange={changeHandler}
                    className="w-full border p-2 rounded mb-4"
                />
                <input
                    type="password" name="password" placeholder="Password"
                    value={input.password} onChange={changeHandler}
                    className="w-full border p-2 rounded mb-4"
                />

                <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="student" checked={input.role === "student"} onChange={changeHandler} />
                        Student
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeHandler} />
                        Recruiter
                    </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="admin" checked={input.role === "admin"} onChange={changeHandler} />
                    Admin
                    </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {loading ? "Please wait..." : "Login"}
                </button>

                <p className="text-center mt-4 text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
                </p>
                
            </form>
        </div>
    );
};

export default Login;