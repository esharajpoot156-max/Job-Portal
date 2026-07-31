import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
    return (
        <div className="group relative border dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-[#1a1a1d] hover:shadow-2xl hover:shadow-[#8B5CF6]/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            {/* top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#ACFFD2] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>

            <div className="flex items-center gap-3 mb-4">
                {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-lg">
                        {job.company?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-sm dark:text-white">{job.company?.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        📍 {job.location}
                    </p>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-2 dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                {job.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 min-h-[2.5rem]">
                {job.Description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 px-3 py-1 rounded-full font-medium">
                    {job.jobType}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded-full font-medium">
                    👥 {job.position} openings
                </span>
                <span className="text-xs bg-[#ACFFD2] px-3 py-1 rounded-full text-gray-900 font-semibold">
                    💰 Rs {job.salary}
                </span>
            </div>

            <Link
                to={`/jobs/${job._id}`}
                className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-[#8B5CF6] text-white py-2.5 rounded-xl font-medium group-hover:bg-[#8B5CF6] transition-colors"
            >
                View Details
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    );
};

export default JobCard;