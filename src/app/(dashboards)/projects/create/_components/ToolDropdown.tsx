'use client';
import { Dropdown } from "@/components/dropdown";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import { GetTools } from "../../../../../../api/projects/projectApi";
import { ToolOptionList } from "../../../../../types/Project.types";
type ToolDropdownProps = {
  control: any;
  name: string;
  placeholder?: string;
  errors?: any;
};

const ToolDropdown: FC<ToolDropdownProps> = ({ control, name, placeholder, errors }) => {

  const {
    data: tools,
    isFetching: toolsLoading,
    refetch: toolsaRefetch,
  } = useQuery<ToolOptionList>({
    queryKey: ["getTools"],
    queryFn: () => GetTools(),
  });

  console.log("ToolDropdown", tools);

  const toolOptions = tools?.map((tool) => ({
    value: tool.toolName,
    label: tool.toolName,
  })) || [];

  return (
    <div className="w-full max-w-[553px] mt-10 relative">
      <label htmlFor="projectName" className="text-sm font-medium text-black pb-[6px]">Tool
        <span className="text-errorColor pl-1">*</span>
      </label>
      <Dropdown
        control={control}
        name={name}
        placeholder={placeholder || "Select"}
        className="w-full max-w-[553px]"
        additionalText="Select the management tool you use to manage this project"
        active={true}
        errors={errors}
        message={errors}
        options={toolOptions}
    />
      {errors && (
        <p className="text-errorColor text-sm font-medium absolute">{errors}</p>
      )}
    </div>
  );
};

export default ToolDropdown;