const JobCardSkeleton = () => {
    return (
        <div className="border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-[#1a1a1d] animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    );
};

export default JobCardSkeleton;