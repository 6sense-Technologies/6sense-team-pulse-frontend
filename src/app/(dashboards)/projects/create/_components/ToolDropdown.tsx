"use client";
import { Dropdown } from "@/components/dropdown";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import { GetTools } from "../../../../../../helpers/projects/projectApi";
import { ToolOptionList } from "../../../../../types/Project.types";
type ToolDropdownProps = {
  control: any;
  name: string;
  placeholder?: string;
  errors?: any;
  index?: number;
};

const ToolDropdown: FC<ToolDropdownProps> = ({
  control,
  name,
  placeholder,
  errors,
  index,
}) => {
  const {
    data: tools,
  } = useQuery<ToolOptionList>({
    queryKey: ["getTools"],
    queryFn: () => GetTools(),
  });

  // console.log("ToolDropdown", tools);

  const toolOptions =
    tools?.map((tool) => ({
      value: tool.toolName,
      label: tool.toolName,
    })) || [];

  return (
    <div className="w-full max-w-[553px] pl-2 lg:pl-0 mt-3 lg:mt-8 relative">
      <label
        htmlFor="projectName"
        className="text-sm font-medium text-black pb-[6px]"
      >
        Tool
        {index === 0 && <span className="text-destructive pl-1">*</span>}
      </label>
      <Dropdown
        control={control}
        name={name}
        placeholder={placeholder || "Select"}
        className="w-full max-w-[553px] placeholder:text-subHeading"
        additionalText="Select the management tool you use to manage this project"
        active={true}
        errors={errors}
        message={errors}
        options={toolOptions}
      />
      {errors && (
        <p className="text-destructive text-twelve md:text-sm font-medium absolute pt-1">
          {errors}
        </p>
      )}
    </div>
  );
};

export default ToolDropdown;
