import React, { FC } from 'react'
import RoleDropdown from './roleDropdown'


type AccessControlAreaProps = {
  control: any;
  errors: any;
}

const AccessControlArea :FC<AccessControlAreaProps> = ({control,errors}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start  w-full max-w-[872px] lg:pt-12">
    <div className="pl-[6px] pt-8 lg:pt-0 w-full lg:max-w-[316px]">
      <h1 className="text-[16px] lg:text-headingXXS font-semibold">
        Access Control
      </h1>
    </div>
    <div className="w-full max-w-[420px]">
    <div className="w-full max-w-[553px] pl-0 lg:!pl-0">
    <RoleDropdown
      control={control}
      name="role"
      placeholder="Select"
      errors={errors?.role?.message}
      index={0}
    />
    </div>
    </div>
  </div>
  )
}

export default AccessControlArea
