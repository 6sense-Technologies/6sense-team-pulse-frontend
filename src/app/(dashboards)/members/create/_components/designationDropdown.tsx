"use client";
import { Dropdown } from "@/components/dropdown";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import { GetDesignations } from "../../../../../../helpers/projects/projectApi";
import { Designations } from "@/types/Members.types";

type DesignationDropdownProps = {
  control: any;
  name: string;
  placeholder?: string;
  errors?: any;
  index?: number;
};

const DesignationDropdown: FC<DesignationDropdownProps> = ({ control, name, placeholder, errors, index }) => {
  const { data: designations } = useQuery<Designations>({
    queryKey: ["getDesignations"],
    queryFn: () => GetDesignations(),
  });

  //

  const designationOptions =
    designations?.designations?.map((designation) => ({
      value: designation,
      label: designation,
    })) || [];

  //

  return (
    <div className="w-full max-w-[553px] pl-2 lg:pl-0 mt-3 lg:mt-8 relative">
      <label htmlFor="designation" className="text-sm font-medium text-black">
        Designation
        {index === 0 && <span className="text-destructive pl-1">*</span>}
      </label>
      <Dropdown
        control={control}
        name={name}
        placeholder={placeholder || "Select"}
        className={`w-full max-w-[553px] placeholder:text-subHeading ${errors ? "border-destructive" : null}`}
        additionalText="Enter member's designation"
        active={true}
        errors={errors}
        message={errors}
        options={designationOptions}
      />
      {errors && <p className="text-destructive text-twelve md:text-sm font-medium absolute pt-1">{errors}</p>}
    </div>
  );
};

export default DesignationDropdown;
