import { Dropdown } from "@/components/dropdown";
import React, { FC } from "react";

type ToolDropdownProps = {
  control: any;
};

const ToolDropdown: FC<ToolDropdownProps> = ({ control }) => {
  return (
    <div className="w-full max-w-[553px] pt-10">
      <label htmlFor="projectName text-sm font-medium text-black">Tool</label>
      <Dropdown
        control={control}
        name="toolName"
        placeholder="Select"
        className="w-full max-w-[553px]"
        additionalText="Select the management tool you use to manage this project"
        active={true}
      />
    </div>
  );
};

export default ToolDropdown;
