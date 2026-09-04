import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Lock, Bell, Palette, ShieldOff, Eye, EyeOff, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "../utils/ThemeContext";
import { setUser } from "../redux/authSlice";

const TABS = [
    { id: "account", label: "Account & Security", icon: Lock },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "blocked", label: "Blocked Users", icon: ShieldOff },
    { id: "delete", label: "Delete Account", icon: Trash2 },
];

const Section = ({ title, children }) => (
    <div className="bg-white dark:bg-[#1a1a1d] border dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
        {children}
    </div>
);

const PasswordField = ({ label, value, onChange }) => {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input type={show ? "text" : "password"} value={value} onChange={onChange} className="w-full px-4 py-2.5 pr-11 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
};

const strengthLabel = (p) => {
    if (!p) return null;
    const score = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
    return ["Weak", "Weak", "Fair", "Good", "Strong"][score];
};

const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between gap-4">
        <div>
            <p className="font-medium dark:text-white">{label}</p>
            {desc && <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        </div>
        <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-[#8B5CF6]" : "bg-gray-300 dark:bg-gray-700"}`}>
            <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
    </div>
);

const SettingsPage = () => {
    const { darkMode, setDarkMode } = useTheme();
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const isRecruiter = user?.role === "recruiter";
    const [tab, setTab] = useState("account");
    const [saving, setSaving] = useState(false);
    const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
    const [notif, setNotif] = useState({ emailUpdates: user?.notifications?.emailUpdates ?? true, jobAlerts: user?.notifications?.jobAlerts ?? true });
    const [privacy, setPrivacy] = useState({ publicProfile: user?.privacy?.publicProfile ?? true, hideSalary: user?.privacy?.hideSalary ?? false, messagePermission: user?.privacy?.messagePermission ?? "everyone" });
    const [blocked, setBlocked] = useState([]);

    const run = async (fn, successMsg) => {
        setSaving(true);
        try {
            const res = await fn();
            if (res.data.success && successMsg) alert(successMsg);
            return res;
        } catch (e) {
            alert(e.response?.data?.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async () => {
        if (pwd.next !== pwd.confirm) return alert("New passwords don't match");
        const res = await run(() => axiosInstance.post("/user/change-password", { currentPassword: pwd.current, newPassword: pwd.next }), "Password changed");
        if (res?.data.success) setPwd({ current: "", next: "", confirm: "" });
    };

    const savePrivacy = async () => {
        const payload = isRecruiter ? { messagePermission: privacy.messagePermission } : privacy;
        const res = await run(() => axiosInstance.post("/user/update-privacy", payload), "Privacy settings saved");
        if (res?.data.success) dispatch(setUser({ ...user, privacy: res.data.privacy }));
    };

    const saveNotifications = async () => {
        const payload = isRecruiter ? { emailUpdates: notif.emailUpdates } : notif;
        const res = await run(() => axiosInstance.post("/user/update-notifications", payload), "Notification settings saved");
        if (res?.data.success) dispatch(setUser({ ...user, notifications: res.data.notifications }));
    };

    const fetchBlockedUsers = async () => {
        try {
            const res = await axiosInstance.get("/user/blocked");
            if (res.data.success) setBlocked(res.data.blockedUsers);
        } catch (e) { console.log(e); }
    };

    const unblockUser = async (id) => {
        try {
            const res = await axiosInstance.post(`/user/unblock/${id}`);
            if (res.data.success) {
                setBlocked((prev) => prev.filter((u) => u._id !== id));
                dispatch(setUser({ ...user, blockedUsers: (user.blockedUsers || []).filter((bid) => bid !== id) }));
            }
        } catch (e) { alert(e.response?.data?.message || "Could not unblock user"); }
    };

    const deleteAccount = async () => {
        if (!confirm("This will permanently delete your account. Continue?")) return;
        try {
            const res = await axiosInstance.delete("/user/delete-account");
            if (res.data.success) window.location.href = "/login";
        } catch (e) { alert(e.response?.data?.message || "Could not delete account"); }
    };

    const selectTab = (id) => { setTab(id); if (id === "blocked") fetchBlockedUsers(); };

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
                <h1 className="text-2xl font-bold dark:text-white mb-6">Settings</h1>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-56 shrink-0 pb-2 md:pb-0">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => selectTab(id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === id ? "bg-[#8B5CF6] text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1d]"}`}>
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 space-y-6">
                        {tab === "account" && (
                            <Section title="Change Password">
                                <PasswordField label="Current Password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
                                <PasswordField label="New Password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
                                {pwd.next && <p className="text-xs text-gray-500 -mt-2">Strength: {strengthLabel(pwd.next)}</p>}
                                <PasswordField label="Confirm New Password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
                                <button onClick={changePassword} disabled={saving} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">{saving ? "Updating..." : "Update Password"}</button>
                            </Section>
                        )}

                        {tab === "privacy" && (
                            <Section title="Privacy">
                                {!isRecruiter && (
                                    <>
                                        <Toggle label="Public Profile" desc="Recruiters can view your profile" checked={privacy.publicProfile} onChange={(v) => setPrivacy({ ...privacy, publicProfile: v })} />
                                        <Toggle label="Hide Salary Expectations" desc="Recruiters won't see your expected salary" checked={privacy.hideSalary} onChange={(v) => setPrivacy({ ...privacy, hideSalary: v })} />
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Who can message me</label>
                                    <select value={privacy.messagePermission} onChange={(e) => setPrivacy({ ...privacy, messagePermission: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]">
                                        <option value="everyone">Everyone</option>
                                        {!isRecruiter && <option value="recruiters">Recruiters Only</option>}
                                        <option value="none">No One</option>
                                    </select>
                                </div>
                                <button onClick={savePrivacy} disabled={saving} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
                            </Section>
                        )}

                        {tab === "notifications" && (
                            <Section title="Notification Preferences">
                                <Toggle label="Email Updates" desc="Get emailed about important account activity" checked={notif.emailUpdates} onChange={(v) => setNotif({ ...notif, emailUpdates: v })} />
                                {!isRecruiter && (
                                    <Toggle label="Job Alerts" desc="Get notified about new jobs matching your profile" checked={notif.jobAlerts} onChange={(v) => setNotif({ ...notif, jobAlerts: v })} />
                                )}
                                <button onClick={saveNotifications} disabled={saving} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
                            </Section>
                        )}

                        {tab === "appearance" && (
                            <Section title="Appearance">
                                <Toggle label="Dark Mode" desc="Switch between light and dark theme" checked={darkMode} onChange={setDarkMode} />
                            </Section>
                        )}

                        {tab === "blocked" && (
                            <Section title="Blocked Users">
                                {blocked.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">You haven't blocked anyone.</p>
                                ) : (
                                    blocked.map((u) => (
                                        <div key={u._id} className="flex items-center justify-between border-b dark:border-gray-800 pb-3">
                                            <span className="dark:text-white">{u.fullname}</span>
                                            <button onClick={() => unblockUser(u._id)} className="text-sm text-[#8B5CF6] font-medium">Unblock</button>
                                        </div>
                                    ))
                                )}
                            </Section>
                        )}

                        {tab === "delete" && (
                            <Section title="Delete Account">
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">This action is permanent and cannot be undone.</p>
                                    <button onClick={deleteAccount} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium">Delete Account</button>
                                </div>
                            </Section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;