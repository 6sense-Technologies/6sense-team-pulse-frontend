import React, { FC } from 'react'

interface IHeadingProps {
    title: string;
    subTitle ?: string;
}

const PageHeading : FC<IHeadingProps> = ({title, subTitle}) => {
  return (
    <div>
      <h3 className='text-headingXS md:text-headingBase font-semibold'>{title}</h3>
      <p className='text-headingXXS md:text-base font-semibold text-subHeading'>{subTitle}</p>
    </div>
  )
}

export default PageHeading
