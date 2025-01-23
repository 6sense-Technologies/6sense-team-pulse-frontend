"use client";
import { BaseInput } from "@/components/BaseInput";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { ProjectSchema } from "../../../../../Zodschema/projectSchema";
import { Dropdown } from "@/components/dropdown";
import { Button } from "@/components/ButtonComponent";
import ToolDropdown from "./_components/ToolDropdown";
import WorkspaceURL from "./_components/WorkspaceURL";

const ProjectCreate = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: zodResolver(ProjectSchema),
  });

  return (
    <div className="w-full">
      <PageTitle pageName="Ops4 Team" title="Create Project" />
      <form>
        <div className="pl-[24px] pr-[14px] w-full">
          <GlobalBreadCrumb
            initialData="Projects"
            initalLink="/projects"
            secondayData="Create"
            secondayLink="/projects/create"
          />
          <PageHeading
            title="Create Project"
            subTitle="Some examples built using the components. Use this as a guide to build your own."
            className="pl-[5px]"
          />

          {/* <hr className="mt-[12px]" /> */}

          <div className="flex items-center justify-between w-full max-w-[872px] pt-8">
            <div className="pl-[6px]">
              <h1 className="text-headingXXS font-semibold pb-2">
                Project Info
              </h1>
            </div>
            <div className="w-full max-w-[553px] pt-10">
              <label htmlFor="projectName text-sm font-medium text-black">
                Project Name
              </label>
              <BaseInput
                control={control}
                type="text"
                name="projectName"
                placeholder="Project Name"
                className="placeholder:text-subHeading w-full  mt-[4px]"
                additionalText="The project name you used in your code project"
              />
            </div>
          </div>
          {/* <hr className="mt-12 w-full max-w-[870px]" /> */}

          <div className="flex items-center justify-between w-full max-w-[872px]">
            <div className="pl-[6px]">
              <h1 className="text-headingXXS font-semibold pb-2">
                Project Management Tool
              </h1>
            </div>
            <ToolDropdown control={control} />
          </div>
          <WorkspaceURL control={control} />
          <Button>Add Tool</Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreate;
