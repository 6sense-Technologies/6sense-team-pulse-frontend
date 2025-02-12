import { BaseInput } from '@/components/BaseInput'
import React, { FC } from 'react'
import ProjectDropdown from './projectDropdown'

type WorkInfoAreaProps = {
  control: any;
  errors: any;
}

const WorkInfoArea :FC<WorkInfoAreaProps> = ({control,errors}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start  w-full max-w-[872px] pt-8 lg:pt-12 lg:gap-x-[220px]">
    <div className="pl-[6px] pt-4 lg:pt-0">
      <h1 className="text-[16px] lg:text-headingXXS font-semibold">
        Work Info
      </h1>
    </div>
    <div className="w-full max-w-[420px]">
    <div className="w-full max-w-[553px] pt-4 lg:pl-0 lg:pt-0">
    <ProjectDropdown
      control={control}
      name="project"
      placeholder="Select"
      errors={errors.tools?.[0]?.toolName?.message}
      index={0}
    />
    </div>
    <div className="w-full max-w-[553px] pl-2 pt-8 lg:pl-0 lg:pt-8">
      <label
        htmlFor="jira"
        className="text-sm font-medium text-black"
      >
        Jira <span className="text-subHeading text-[10px]">(Optional)</span>
      </label>
      <BaseInput
        control={control}
        name="jira"
        type="text"
        placeholder="Jira"
        className="placeholder:text-subHeading w-full mt-[4px]"
        additionalText="Enter the Jira Account ID"
        errors={errors}
        errorclassName="mt-1"
      />
    </div>
    <div className="w-full max-w-[553px] pl-2 pt-8 lg:pl-0 lg:pt-8">
      <label
        htmlFor="trello"
        className="text-sm font-medium text-black"
      >
        Trello ID <span className="text-subHeading text-[10px]">(Optional)</span>
      </label>
      <BaseInput
        control={control}
        name="trello"
        type="text"
        placeholder="Trello ID"
        className="placeholder:text-subHeading w-full mt-[4px]"
        additionalText="Enter the Trello Account ID"
        errors={errors}
        errorclassName="mt-1"
      />
    </div>
    <div className="w-full max-w-[553px] pl-2 pt-8 lg:pl-0 lg:pt-8">
      <label
        htmlFor="github"
        className="text-sm font-medium text-black"
      >
        GitHub Username <span className="text-subHeading text-[10px]">(Optional)</span>
      </label>
      <BaseInput
        control={control}
        name="github"
        type="text"
        placeholder="GitHub Username"
        className="placeholder:text-subHeading w-full mt-[4px]"
        additionalText="Enter the GitHub Username"
        errors={errors}
        errorclassName="mt-1"
      />
    </div>
    </div>
  </div>
  )
}

export default WorkInfoArea
