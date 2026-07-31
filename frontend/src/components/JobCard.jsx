import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
    return (
        <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition bg-white dark:bg-[#1a1a1d] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
                {job.company?.logo && (
                    <img src={job.company.logo} alt={job.company.name} className="w-10 h-10 rounded object-cover" />
                )}
                <div>
                    <h3 className="font-semibold dark:text-white">{job.company?.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-1 dark:text-white">{job.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{job.Description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">{job.jobType}</span>
                <span className="text-xs bg-[#F4F4F5] dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">{job.position} positions</span>
                <span className="text-xs bg-[#ACFFD2] px-2 py-1 rounded text-gray-900">₨ {job.salary}</span>
            </div>

            <Link to={`/jobs/${job._id}`} className="block text-center w-full bg-[#8B5CF6] text-white py-2 rounded hover:opacity-90">
                Details
            </Link>
        </div>
    );
};

export default JobCard;