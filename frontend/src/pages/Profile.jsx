import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Mail, Phone, MapPin } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/authSlice";

const Profile = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        city: user?.profile?.city || "",
        qualification: user?.profile?.qualification || "",
        skills: user?.profile?.skills?.join(", ") || "",
        experience: user?.profile?.experience || "",
        jobPreference: user?.profile?.jobPreference || "",
        salaryExpectation: user?.profile?.salaryExpectation || "",
        bio: user?.profile?.bio || ""
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileCreated, setProfileCreated] = useState(
        !!(user?.profile?.bio || user?.profile?.qualification || user?.profile?.skills?.length || user?.profile?.resume)
    );

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileHandler = (e) => {
        setFile(e.target.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(input).forEach(([key, value]) => formData.append(key, value));
        if (file) formData.append("file", file);

        try {
            setLoading(true);
            const res = await axiosInstance.post("/user/profile/update", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                setProfileCreated(true);
                alert(res.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full border p-2 rounded pl-9 text-gray-600 dark:text-gray-300 dark:bg-[#1a1a1d] dark:border-gray-700";
    const plainInputClass =
        "w-full border p-2 rounded text-gray-600 dark:text-gray-300 dark:bg-[#1a1a1d] dark:border-gray-700";
    const labelClass = "text-sm text-gray-500 dark:text-gray-400";

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">
                {profileCreated ? "My Profile" : "Create Profile"}
            </h1>

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                        type="text"
                        name="fullname"
                        required
                        value={input.fullname}
                        onChange={changeHandler}
                        className={plainInputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Email *</label>
                    <div className="relative">
                        <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={input.email}
                            onChange={changeHandler}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Phone Number *</label>
                    <div className="relative">
                        <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name="phoneNumber"
                            required
                            value={input.phoneNumber}
                            onChange={changeHandler}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>City *</label>
                    <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name="city"
                            required
                            value={input.city}
                            onChange={changeHandler}
                            className={inputClass}
                        />
                    </div>
                </div>


                <div>
                    <label className={labelClass}>Bio</label>
                    <textarea
                        name="bio"
                        value={input.bio}
                        onChange={changeHandler}
                        rows={3}
                        className={plainInputClass}
                    />
                </div>

                {user?.role === "student" && (
                    <>
                            <div>
            <label className={labelClass}>Qualification *</label>
            <input
                type="text"
                name="qualification"
                required
                value={input.qualification}
                onChange={changeHandler}
                className={plainInputClass}
            />
        </div>
                        <div>
                            <label className={labelClass}>Skills *</label>
                            <input
                                type="text"
                                name="skills"
                                required
                                placeholder="Comma separated"
                                value={input.skills}
                                onChange={changeHandler}
                                className={plainInputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Experience</label>
                            <input
                                type="text"
                                name="experience"
                                placeholder="e.g. 2 years"
                                value={input.experience}
                                onChange={changeHandler}
                                className={plainInputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Job Preference</label>
                            <input
                                type="text"
                                name="jobPreference"
                                placeholder="e.g. Remote, Full-time"
                                value={input.jobPreference}
                                onChange={changeHandler}
                                className={plainInputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Salary Expectation (optional)</label>
                            <input
                                type="text"
                                name="salaryExpectation"
                                placeholder="e.g. 50,000 - 70,000 / month"
                                value={input.salaryExpectation}
                                onChange={changeHandler}
                                className={plainInputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Resume *</label>
                            <div className="flex items-center gap-3 border rounded p-2 dark:border-gray-700">
                                <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded text-sm">
                                    Choose File
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        required={!profileCreated}
                                        onChange={fileHandler}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {file ? file.name : "No file chosen"}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto sm:px-10 sm:mx-auto sm:block bg-[#8B5CF6] text-white py-2 rounded"
                >
                    {loading
                        ? profileCreated ? "Saving..." : "Creating..."
                        : profileCreated ? "Save Changes" : "Create Profile"}
                </button>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto sm:px-10 sm:mx-auto sm:block text-sm text-gray-500 dark:text-gray-400 py-2"
                >
                    ← Back
                </button>
            </form>
        </div>
    );
};

export default Profile;