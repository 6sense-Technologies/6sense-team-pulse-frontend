import { BaseInput } from "@/components/BaseInput";
import React, { FC } from "react";

type WorkspaceURLProps = {
    control: any;
    name: string;
  };


const WorkspaceURL : FC<WorkspaceURLProps> = ({control,name}) => {
  return (
    <div className="w-full max-w-[553px] pt-10">
      <label htmlFor="projectName text-sm font-medium text-black pb-2">
        Workspace URL
      </label>
      <BaseInput
        control={control}
        type="text"
        name={name}
        placeholder="https://"
        className="placeholder:text-subHeading w-full  mt-[4px] flex justify-center"
        additionalText="Project URL of the selected tool"
      />
    </div>
  );
};

export default WorkspaceURL;
