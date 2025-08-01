"use client";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import { MultiDropdown } from "@/components/multidropdown";
import { Project } from "@/types/Members.types";
import { GetProjects } from "../../../../../../helpers/Member/memberApi";
import { useSession } from "next-auth/react";
type ProjectDropdownProps = {
  control: any;
  name: string;
  placeholder?: string;
  errors?: any;
  index?: number;
};

const ProjectDropdown: FC<ProjectDropdownProps> = ({ control, name, placeholder, errors, index }) => {
  const session = useSession();

  const { data } = useQuery<Project[]>({
    queryKey: ["getProjects"],
    queryFn: () => GetProjects(session),
  });

  const projectOptions =
    data?.map((project) => ({
      value: project.name,
      label: project.name,
    })) || [];

  return (
    <div className="w-full max-w-[553px] pl-0 lg:pl-0 lg:mt-0 relative">
      <label htmlFor="designation" className="text-sm font-medium text-black pl-2 lg:pl-0">
        Project
        {index === 0 && <span className="text-subHeading pl-1 text-[10px]">(Optional)</span>}
      </label>
      <MultiDropdown
        control={control}
        name={name}
        placeholder={placeholder || "Select"}
        className="w-full max-w-[553px] placeholder:text-subHeading"
        additionalText="Select the project(s) assigned to the member"
        errors={errors}
        message={errors}
        options={projectOptions}
      />
      {errors && <p className="text-destructive text-twelve md:text-sm font-medium absolute pt-1">{errors}</p>}
    </div>
  );
};

export default ProjectDropdown;
