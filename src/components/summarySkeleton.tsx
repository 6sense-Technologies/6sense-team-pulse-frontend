import React from 'react';
import TitleAvatarSkeleton from './titleAvatarSkeleton';
import MultiTextSkeleton from './multiTextSkeleton';

const SummarySkeleton = () => {
  return (
    <div className="flex space-x-4 animate-pulse">
      <TitleAvatarSkeleton />
      <div className='flex space-x-6'>
      <MultiTextSkeleton />
      <MultiTextSkeleton />
      </div>
    </div>
  );
};

export default SummarySkeleton;