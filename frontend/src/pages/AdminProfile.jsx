import { useSelector } from "react-redux";
import { User, Mail, ShieldCheck } from "lucide-react";

const Section = ({ title, children }) => (
    <div className="bg-white dark:bg-[#1a1a1d] border dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
        {children}
    </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <Icon size={18} className="text-[#8B5CF6]" />
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-medium dark:text-white">{value}</p>
        </div>
    </div>
);

const AdminProfile = () => {
    const { user } = useSelector((store) => store.auth);

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
                <h1 className="text-2xl font-bold dark:text-white mb-6">Admin Profile</h1>
                <Section title="Account Information">
                    <InfoRow icon={User} label="Full Name" value={user?.fullname || "N/A"} />
                    <InfoRow icon={Mail} label="Email" value={user?.email || "N/A"} />
                    <InfoRow icon={ShieldCheck} label="Role" value="Administrator" />
                </Section>
            </div>
        </div>
    );
};

export default AdminProfile;