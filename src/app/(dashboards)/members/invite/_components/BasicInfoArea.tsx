import React, { FC } from 'react'
import DesignationDropdown from './designationDropdown'
import { BaseInput } from '@/components/BaseInput'

type BasicInfoAreaProps = {
  control: any;
  errors: any;
}


const BasicInfoArea :FC<BasicInfoAreaProps> = ({control,errors}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start  w-full max-w-[872px] lg:pt-4 lg:gap-x-[220px]">
    <div className="pl-[6px] py-4 lg:pt-0">
      <h1 className="text-[16px] lg:text-headingXXS font-semibold lg:pb-2">
        Basic Info
      </h1>
    </div>
    <div className="w-full max-w-[420px]">
    <div className="w-full max-w-[553px] pl-2 lg:pl-0 lg:pt-2">
      <label
        htmlFor="fullname"
        className="text-sm font-medium text-black"
      >
        Full Name <span className="text-destructive">*</span>
      </label>
      <BaseInput
        control={control}
        name="fullname"
        type="text"
        placeholder="Full Name"
        className="placeholder:text-subHeading w-full mt-[4px]"
        additionalText="Enter member's full name"
        errors={errors}
        errorclassName="mt-1"
      />
    </div>
    <div className="w-full max-w-[553px] pl-2 lg:pl-0 pt-8 lg:pt-8">
      <label
        htmlFor="email"
        className="text-sm font-medium text-black"
      >
        Email <span className="text-destructive">*</span>
      </label>
      <BaseInput
        control={control}
        name="email"
        type="email"
        placeholder="Email"
        className="placeholder:text-subHeading w-full mt-[4px]"
        additionalText="Enter member's email address"
        errors={errors}
        errorclassName="mt-1"
      />
    </div>
    <div className="w-full max-w-[553px] lg:pl-0 pt-4 lg:pt-0">
      <DesignationDropdown
      control={control}
      name="designation"
      placeholder="Select"
      errors={errors.tools?.[0]?.toolName?.message}
      index={0}
    />
    </div>
    </div>
  </div>
  )
}

export default BasicInfoArea
