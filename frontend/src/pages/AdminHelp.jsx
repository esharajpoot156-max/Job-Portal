import { Mail, HelpCircle } from "lucide-react";

const Section = ({ title, children }) => (
    <div className="bg-white dark:bg-[#1a1a1d] border dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
        {children}
    </div>
);

const AdminHelp = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
                <h1 className="text-2xl font-bold dark:text-white mb-6">Help & Support</h1>

                <div className="space-y-6">
                    <Section title="Frequently Asked Questions">
                        <div>
                            <p className="font-medium dark:text-white flex items-center gap-2"><HelpCircle size={16} className="text-[#8B5CF6]" /> How do I manage users?</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Go to Dashboard → Manage Users to view, edit, or remove accounts.</p>
                        </div>
                        <div>
                            <p className="font-medium dark:text-white flex items-center gap-2"><HelpCircle size={16} className="text-[#8B5CF6]" /> How do I reset my password?</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Use Settings → Account & Security to update your password.</p>
                        </div>
                    </Section>

                    <Section title="Contact Support">
                        <a href="mailto:support@jobease.com" className="flex items-center gap-2 text-[#8B5CF6] font-medium">
                            <Mail size={18} /> support@jobease.com
                        </a>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default AdminHelp;