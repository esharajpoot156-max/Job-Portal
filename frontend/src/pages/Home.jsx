import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
    const { user } = useSelector((store) => store.auth);

    return (
            <div className="min-h-[calc(100vh-73px)] bg-white dark:bg-[#121214] dark:text-white">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-24">
                <span className="text-sm bg-[#F4F4F5] dark:bg-gray-800 px-4 py-1 rounded-full mb-6">
                    Find your next opportunity
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
                    Connect Talent with <span className="text-[#8B5CF6]">Opportunity</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-8">
                    A simple job portal where students find jobs, and recruiters find the right people — fast, easy, and free.
                </p>

                <div className="flex gap-4">
                    <Link
                        to="/jobs"
                        className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
                    >
                        Browse Jobs
                    </Link>
                    {!user && (
                        <Link
                            to="/register"
                            className="border border-[#8B5CF6] text-[#8B5CF6] px-6 py-3 rounded-lg font-medium"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-24 max-w-5xl mx-auto">
                <div className="p-6 rounded-lg border dark:border-gray-700">
                    <div className="w-10 h-10 rounded bg-[#ACFFD2] flex items-center justify-center mb-4 text-lg">
                        🔍
                    </div>
                    <h3 className="font-semibold mb-2">Search Jobs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Filter by location, salary, and experience to find the right fit.
                    </p>
                </div>

                <div className="p-6 rounded-lg border dark:border-gray-700">
                    <div className="w-10 h-10 rounded bg-[#ACFFD2] flex items-center justify-center mb-4 text-lg">
                        💬
                    </div>
                    <h3 className="font-semibold mb-2">Chat Directly</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Message recruiters or applicants in real time, right from the platform.
                    </p>
                </div>

                <div className="p-6 rounded-lg border dark:border-gray-700">
                    <div className="w-10 h-10 rounded bg-[#ACFFD2] flex items-center justify-center mb-4 text-lg">
                        🔔
                    </div>
                    <h3 className="font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get notified instantly when your application status changes.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;