'use client';

const TableSkeleton = () => {
    const skeletonRows = Array.from({ length: 5 });

    return (
        <div
            role="status"
            className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
            {skeletonRows.map((_, index) => (
                <div key={index} className="flex items-center justify-between pt-4 first:pt-0">
                    <div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
            ))}
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default TableSkeleton;