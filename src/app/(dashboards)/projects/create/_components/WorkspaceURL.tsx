import * as React from "react";
import { BaseInput } from "@/components/BaseInput";

type WorkspaceURLProps = {
  control: any;
  name: any;
  errors?: any;
  index?: number;
};

const WorkspaceURL: React.FC<WorkspaceURLProps> = ({
  control,
  name,
  errors,
  index,
}) => {
  // console.log("WorkspaceURL", name);

  return (
    <div className="w-full max-w-[553px] pt-8 md:pt-10 relative">
      <label
        htmlFor="workspace"
        className="text-sm font-medium text-black pb-[6px]"
      >
        Workspace URL
        {index === 0 && <span className="text-destructive pl-1">*</span>}
      </label>
      <BaseInput
        control={control}
        type="text"
        name={name}
        placeholder="https://"
        className="placeholder:text-subHeading w-full mt-[6px]"
        additionalText="Project URL of the selected tool"
        message={errors}
      />
      {errors && (
        <p className="text-destructive text-twelve md:text-sm font-medium pt-1 absolute">
          {errors}
        </p>
      )}
    </div>
  );
};

export default WorkspaceURL;
