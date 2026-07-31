import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#F4F4F5] dark:bg-[#1a1a1d] border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-[#8B5CF6] mb-2">Job Portal</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connecting talent with opportunity — simple, fast, and free.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3 text-sm text-gray-900 dark:text-white">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li><Link to="/" className="hover:text-[#8B5CF6]">Home</Link></li>
                        <li><Link to="/jobs" className="hover:text-[#8B5CF6]">Jobs</Link></li>
                        <li><Link to="/register" className="hover:text-[#8B5CF6]">Register</Link></li>
                        <li><Link to="/login" className="hover:text-[#8B5CF6]">Login</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3 text-sm text-gray-900 dark:text-white">Contact</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">support@jobportal.com</p>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Job Portal. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;