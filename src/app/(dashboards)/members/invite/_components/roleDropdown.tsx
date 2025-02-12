"use client";
import { Dropdown } from "@/components/dropdown";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import { GetTools } from "../../../../../../helpers/projects/projectApi";
import { ToolOptionList } from "../../../../../types/Project.types";
type RoleDropdownProps = {
  control: any;
  name: string;
  placeholder?: string;
  errors?: any;
  index?: number;
};

const RoleDropdown: FC<RoleDropdownProps> = ({
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
    <div className="w-full max-w-[553px] pl-2 pt-4 lg:pt-0 lg:pl-0 relative">
      <label
        htmlFor="designation"
        className="text-sm font-medium text-black"
      >
        Role
        {index === 0 && <span className="text-destructive pl-1">*</span>}
      </label>
      <Dropdown
        control={control}
        name={name}
        placeholder={placeholder || "Select"}
        className="w-full max-w-[553px] placeholder:text-subHeading"
        additionalText="Select a role to assign portal access"
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

export default RoleDropdown;
