import { useState } from "react";
import { Lock, Bell, Palette, ShieldOff, Eye, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "../utils/ThemeContext";

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

const Field = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" />
    </div>
);

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
    const [tab, setTab] = useState("account");
    const [saving, setSaving] = useState(false);
    const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
    const [twoFA, setTwoFA] = useState(false);
    const [notif, setNotif] = useState({ emailUpdates: true, jobAlerts: true });
    const [privacy, setPrivacy] = useState({ publicProfile: true, hideSalary: false, messagePermission: "everyone" });
    const [blocked, setBlocked] = useState([]); // [{ _id, fullname }]

    const changePassword = async () => {
        if (pwd.next !== pwd.confirm) return alert("New passwords don't match");
        setSaving(true);
        try {
            const res = await axiosInstance.post("/user/change-password", { currentPassword: pwd.current, newPassword: pwd.next });
            if (res.data.success) {
                alert("Password changed");
                setPwd({ current: "", next: "", confirm: "" });
            }
        } catch (e) {
            alert(e.response?.data?.message || "Could not change password");
        } finally {
            setSaving(false);
        }
    };

    const savePrivacy = async () => {
        setSaving(true);
        try {
            const res = await axiosInstance.post("/user/update-privacy", privacy);
            if (res.data.success) alert("Privacy settings saved");
        } catch (e) {
            alert(e.response?.data?.message || "Could not save privacy settings");
        } finally {
            setSaving(false);
        }
    };

    const unblockUser = async (id) => {
        try {
            const res = await axiosInstance.post(`/user/unblock/${id}`);
            if (res.data.success) setBlocked((prev) => prev.filter((u) => u._id !== id));
        } catch (e) {
            alert(e.response?.data?.message || "Could not unblock user");
        }
    };

    const deleteAccount = async () => {
        if (!confirm("This will permanently delete your account. Continue?")) return;
        try {
            const res = await axiosInstance.delete("/user/delete-account");
            if (res.data.success) window.location.href = "/login";
        } catch (e) {
            alert(e.response?.data?.message || "Could not delete account");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
                <h1 className="text-2xl font-bold dark:text-white mb-6">Settings</h1>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-56 shrink-0 pb-2 md:pb-0">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                                    tab === id ? "bg-[#8B5CF6] text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1d]"
                                }`}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 space-y-6">
                        {tab === "account" && (
                            <Section title="Change Password">
                                <Field label="Current Password" type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
                                <Field label="New Password" type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
                                <Field label="Confirm New Password" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
                                <button onClick={changePassword} disabled={saving} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
                                    {saving ? "Updating..." : "Update Password"}
                                </button>
                                <hr className="border-gray-200 dark:border-gray-700" />
                                <Toggle label="Two-Factor Authentication" desc="Require a code at login for extra security" checked={twoFA} onChange={setTwoFA} />
                            </Section>
                        )}

                        {tab === "privacy" && (
                            <Section title="Privacy">
                                <Toggle label="Public Profile" desc="Recruiters can view your profile" checked={privacy.publicProfile} onChange={(v) => setPrivacy({ ...privacy, publicProfile: v })} />
                                <Toggle label="Hide Salary Expectations" desc="Recruiters won't see your expected salary" checked={privacy.hideSalary} onChange={(v) => setPrivacy({ ...privacy, hideSalary: v })} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Who can message me</label>
                                    <select
                                        value={privacy.messagePermission}
                                        onChange={(e) => setPrivacy({ ...privacy, messagePermission: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                                    >
                                        <option value="everyone">Everyone</option>
                                        <option value="recruiters">Recruiters Only</option>
                                        <option value="none">No One</option>
                                    </select>
                                </div>
                                <button onClick={savePrivacy} disabled={saving} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </Section>
                        )}

                        {tab === "notifications" && (
                            <Section title="Notification Preferences">
                                <Toggle label="Email Updates" desc="Get emailed about important account activity" checked={notif.emailUpdates} onChange={(v) => setNotif({ ...notif, emailUpdates: v })} />
                                <Toggle label="Job Alerts" desc="Get notified about new jobs matching your profile" checked={notif.jobAlerts} onChange={(v) => setNotif({ ...notif, jobAlerts: v })} />
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
                                    <button onClick={deleteAccount} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium">
                                        Delete Account
                                    </button>
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