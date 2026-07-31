import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
    return (
        <div className="group border dark:border-gray-700 rounded-xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all bg-white dark:bg-[#1a1a1d]">
            <div className="flex items-center gap-3 mb-4">
                {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-11 h-11 rounded-lg object-cover" />
                ) : (
                    <div className="w-11 h-11 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold">
                        {job.company?.name?.[0] || "?"}
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-sm dark:text-white">{job.company?.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-2 dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                {job.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{job.Description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full">
                    {job.jobType}
                </span>
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full">
                    {job.position} positions
                </span>
                <span className="text-xs bg-[#ACFFD2] px-2.5 py-1 rounded-full text-gray-900 font-medium">
                    ₨ {job.salary}
                </span>
            </div>

            <Link
                to={`/jobs/${job._id}`}
                className="block text-center w-full bg-[#8B5CF6] text-white py-2.5 rounded-lg hover:opacity-90 font-medium transition-opacity"
            >
                View Details
            </Link>
        </div>
    );
};

export default JobCard;