import React from 'react';
import TitleAvatarSkeleton from './titleAvatarSkeleton';
import MultiTextSkeleton from './multiTextSkeleton';

const SummarySkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-12 animate-pulse pb-0 md:pb-5 lg:pb-0">
      <TitleAvatarSkeleton />
      <div className='flex pt-6 pl-2 lg:pt-0 lg:pl-0 space-x-6 lg:space-x-6'>
      <MultiTextSkeleton />
      <MultiTextSkeleton />
      </div>
    </div>
  );
};

export default SummarySkeleton;