import * as React from "react";
import { BaseInput } from "@/components/BaseInput";

type WorkspaceURLProps = {
  control: any;
  name: any;
  errors?: any;
};

const WorkspaceURL: React.FC<WorkspaceURLProps> = ({ control, name, errors }) => {
  
  console.log("WorkspaceURL", name);

  return (
    <div className="w-full max-w-[553px] pt-10 relative">
      <label htmlFor="workspace" className="text-sm font-medium text-black pb-[6px]">Workspace URL
        <span className="text-errorColor pl-1">*</span>
      </label>
      <BaseInput
        control={control}
        type="text"
        name={name}
        placeholder="Workspace URL"
        className="placeholder:text-subHeading w-full mt-[6px]"
        additionalText="The URL of the workspace you use for this project"
        message={errors}
      />
      {errors && (
        <p className="text-errorColor text-sm font-medium absolute">{errors}</p>
      )}
    </div>
  );
};

export default WorkspaceURL;