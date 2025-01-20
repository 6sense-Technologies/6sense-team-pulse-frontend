import { cn } from '@/lib/utils';
import React, { FC } from 'react'

interface IHeadingProps {
  title: string;
  subTitle?: string;
  titleclassName?: string;
  subTitleClassName?: string;
}

const AuthPageHeader: FC<IHeadingProps> = ({ title, subTitle, titleclassName, subTitleClassName }) => {
  return (
    <div>
      <h3 className={cn('text-2xl md:text-headingBase font-semibold', titleclassName)}>{title}</h3>
      <p className={cn('text-base md:text-base text-subHeading', subTitleClassName)}>{subTitle}</p>
    </div>
  );
};

export default AuthPageHeader 