import React from 'react';

const MultiTextSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="space-y-2">
        <div className="rounded bg-gray-200 h-5 w-32" />
        <div className="rounded bg-gray-200 h-3 w-24" />
      </div>
    </div>
  )
};

export default MultiTextSkeleton;
