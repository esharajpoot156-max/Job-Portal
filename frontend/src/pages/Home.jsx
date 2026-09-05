import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useInView from "../utils/useInView";

const Home = () => {
    const { user } = useSelector((store) => store.auth);
    const isEmployer = user?.role === "recruiter";
    const isAdmin = user?.role === "admin";
    const [statsRef, statsVisible] = useInView();
    const [featuresRef, featuresVisible] = useInView();

    return (
        <div className="min-h-[calc(100vh-73px)] bg-white dark:bg-[#121214] dark:text-white overflow-hidden relative">
            {/* Background glow blobs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#8B5CF6] opacity-20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-[#ACFFD2] opacity-20 rounded-full blur-3xl animation-delay-2000"></div>

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">
                <span className="text-sm bg-[#F4F4F5] dark:bg-gray-800 px-4 py-1.5 rounded-full mb-6 font-medium">
                    {isAdmin ? "🛠️ Platform control center" : "✨ Find your next opportunity"}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-5 max-w-3xl leading-tight">
                    {isAdmin ? (
                        <>Oversee. <span className="text-[#8B5CF6]">Manage.</span> Grow.</>
                    ) : (
                        <>Connect Talent with <span className="text-[#8B5CF6]">Opportunity</span></>
                    )}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-10 text-lg">
                    {isAdmin
                        ? "Oversee jobs, companies, and users from a single dashboard. Keep the platform running smoothly."
                        : "A simple job portal where students find jobs, and recruiters find the right people — fast, easy, and free."}
                </p>

                <div className="flex gap-4">
                    {isAdmin ? (
                        <Link
                            to="/admin"
                            className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-transform shadow-lg shadow-[#8B5CF6]/20"
                        >
                            Admin Panel
                        </Link>
                    ) : isEmployer ? (
                        <Link
                            to="/admin/jobs/post"
                            className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-transform shadow-lg shadow-[#8B5CF6]/20"
                        >
                            Post a Job
                        </Link>
                    ) : (
                        <Link
                            to="/jobs"
                            className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-transform shadow-lg shadow-[#8B5CF6]/20"
                        >
                            Browse Jobs
                        </Link>
                    )}
                    {!user && (
                        <Link
                            to="/register"
                            className="border-2 border-[#8B5CF6] text-[#8B5CF6] px-8 py-3.5 rounded-lg font-medium hover:bg-[#8B5CF6] hover:text-white transition-colors"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section
                ref={statsRef}
                className={`relative flex flex-wrap justify-center gap-12 px-8 pb-20 max-w-4xl mx-auto text-center transition-all duration-700 ${
                    statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
                {isAdmin ? (
                    <>
                        <div>
                            <p className="text-3xl font-bold text-[#8B5CF6]">500+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Jobs</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#8B5CF6]">200+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Registered Companies</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#8B5CF6]">10k+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Platform Users</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <p className="text-3xl font-bold text-[#8B5CF6]">500+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#8B5CF6]">200+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Companies</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#8B5CF6]">10k+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Job Seekers</p>
                        </div>
                    </>
                )}
            </section>

            {/* Features Section */}
            <section
                ref={featuresRef}
                className={`relative grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-28 max-w-5xl mx-auto transition-all duration-700 ${
                    featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
                {isAdmin ? (
                    <>
                        <div className="p-7 rounded-xl border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
                            <div className="w-12 h-12 rounded-lg bg-[#ACFFD2] flex items-center justify-center mb-4 text-xl animate-icon-bounce">
                                📋
                            </div>
                            <h3 className="font-semibold mb-2 text-lg">Manage Jobs</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Review, approve, or remove job postings across the platform.
                            </p>
                        </div>

                        <div className="p-7 rounded-xl border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
                            <div className="w-12 h-12 rounded-lg bg-[#ACFFD2] flex items-center justify-center mb-4 text-xl animate-icon-bounce" style={{ animationDelay: "0.3s" }}>
                                🏢
                            </div>
                            <h3 className="font-semibold mb-2 text-lg">Manage Companies</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Verify recruiters and keep company profiles up to date.
                            </p>
                        </div>

                        <div className="p-7 rounded-xl border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
                            <div className="w-12 h-12 rounded-lg bg-[#ACFFD2] flex items-center justify-center mb-4 text-xl animate-icon-bounce" style={{ animationDelay: "0.6s" }}>
                                👥
                            </div>
                            <h3 className="font-semibold mb-2 text-lg">Manage Users</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Monitor accounts, roles, and activity across the platform.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-7 rounded-xl border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
                            <div className="w-12 h-12 rounded-lg bg-[#ACFFD2] flex items-center justify-center mb-4 text-xl animate-icon-bounce">
                                🔍
                            </div>
                            <h3 className="font-semibold mb-2 text-lg">Search Jobs</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Filter by location, salary, and experience to find the right fit.
                            </p>
                        </div>

                        <div className="p-7 rounded-xl border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
                            <div className="w-12 h-12 rounded-lg bg-[#ACFFD2] flex items-center justify-center mb-4 text-xl animate-icon-bounce" style={{ animationDelay: "0.3s" }}>
                                💬
                            </div>
                            <h3 className="font-semibold mb-2 text-lg">Chat Directly</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Message recruiters or applicants in real time, right from the platform.
                            </p>
                        </div>

                        <div className="p-7 rounded-xl border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
                            <div className="w-12 h-12 rounded-lg bg-[#ACFFD2] flex items-center justify-center mb-4 text-xl animate-icon-bounce" style={{ animationDelay: "0.6s" }}>
                                🔔
                            </div>
                            <h3 className="font-semibold mb-2 text-lg">Stay Updated</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Get notified instantly when your application status changes.
                            </p>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default Home;