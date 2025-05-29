import React from "react";

const Skeleton = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto animate-pulse">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>

        {/* Company Info & Financial Info Skeleton */}
        <div className="flex flex-wrap w-full justify-between gap-6 border p-5">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="md:w-1/5 w-full">
              <div className="flex items-center mb-4 mt-6">
                <div className="h-6 w-6 bg-gray-300 rounded-full mr-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Address Info Skeleton */}
        <div className="flex grid grid-cols-1 sm:grid-cols-2 gap-12 mb-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="space-y-6">
              <div className="mb-6 border p-8">
                <div className="flex items-center mb-4 border-b pb-2">
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;