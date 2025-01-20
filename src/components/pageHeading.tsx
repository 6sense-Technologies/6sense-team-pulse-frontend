import React, { FC } from 'react';
import { cn } from '@/lib/utils';

interface IHeadingProps {
  title: string;
  subTitle?: string;
  titleclassName?: string;
  subTitleClassName?: string;
}

const PageHeading: FC<IHeadingProps> = ({ title, subTitle, titleclassName, subTitleClassName }) => {
  return (
    <div>
      <h3 className={cn('text-headingXS md:text-headingBase font-semibold', titleclassName)}>{title}</h3>
      <p className={cn('text-md md:text-base font-semibold text-subHeading', subTitleClassName)}>{subTitle}</p>
    </div>
  );
};

export default PageHeading;