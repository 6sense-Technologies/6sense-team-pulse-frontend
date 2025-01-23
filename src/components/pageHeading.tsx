import React, { FC } from 'react';
import { cn } from '@/lib/utils';

interface IHeadingProps {
  title: string;
  subTitle?: string;
  titleclassName?: string;
  subTitleClassName?: string;
  className?: string;
}

const PageHeading: FC<IHeadingProps> = ({ title, subTitle, titleclassName, subTitleClassName, className }) => {
  return (
    <div className={cn(className)}>
      <h3 className={cn('text-headingXS md:text-2xl font-bold', titleclassName)}>{title}</h3>
      <p className={cn('text-md md:text-sm text-subHeading pt-2', subTitleClassName)}>{subTitle}</p>
    </div>
  );
};

export default PageHeading;