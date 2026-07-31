import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/authSlice";

const Profile = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || ""
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileHandler = (e) => {
        setFile(e.target.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (file) {
            formData.append("file", file);
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/profile/update", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                alert(res.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                    <input
                        type="text"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeHandler}
                        className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeHandler}
                        className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeHandler}
                        className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Bio</label>
                    <textarea
                        name="bio"
                        value={input.bio}
                        onChange={changeHandler}
                        rows={3}
                        className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                    />
                </div>

                {user?.role === "student" && (
                    <>
                        <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">Skills (comma separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={input.skills}
                                onChange={changeHandler}
                                className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">Resume (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={fileHandler}
                                className="w-full border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#8B5CF6] text-white py-2 rounded"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default Profile;