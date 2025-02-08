import React from 'react';
import TitleAvatarSkeleton from './titleAvatarSkeleton';
import MultiTextSkeleton from './multiTextSkeleton';

const SummarySkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:space-x-12 animate-pulse">
      <TitleAvatarSkeleton />
      <div className='flex pt-6 pl-2 md:pt-0 md:pl-0 space-x-6 md:space-x-6'>
      <MultiTextSkeleton />
      <MultiTextSkeleton />
      </div>
    </div>
  );
};

export default SummarySkeleton;