import React from 'react';

const TextSkeleton = ({ className }: { className?: string }) => {
  return <div className={`animate-pulse bg-gray-200 ${className}`} />;
};

export default TextSkeleton;