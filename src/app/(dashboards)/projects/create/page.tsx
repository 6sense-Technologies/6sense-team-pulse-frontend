"use client";
import { BaseInput } from "@/components/BaseInput";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ProjectSchema } from "../../../../../Zodschema/projectSchema";
import { Button } from "@/components/ButtonComponent";
import ToolDropdown from "./_components/ToolDropdown";
import WorkspaceURL from "./_components/WorkspaceURL";
import { Trash2 } from "lucide-react";

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  const handleAddtools = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    append({ tool: "", url: "" });
  };

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

          <div className="flex items-center justify-between w-full max-w-[872px]">
            <div className="pl-[6px]">
              <h1 className="text-headingXXS font-semibold pb-2">
                Project Management Tool
              </h1>
            </div>
            <ToolDropdown control={control} name="tools" />
          </div>
          <div className="w-full h-full pl-[320px]">
            <WorkspaceURL control={control} name="workspace" />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="w-full h-full pl-[320px] flex-col items-center"
            >
              <ToolDropdown control={control} name={`tools[${index}].tool`} />
              <div className="flex items-center gap-4">
                <WorkspaceURL
                  control={control}
                  name={`workspace[${index}].url`}
                />
                <div className="relative border w-10 h-10 rounded-lg mt-16">
                  <Trash2
                    className="w-5 h-5 text-black cursor-pointer absolute top-2 right-2"
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="mt-14 mb-10 ml-[320px] flex-col items-center">
            <Button
              variant="extralight"
              size="xsExtended"
              onClick={handleAddtools}
            >
              Add Tool
            </Button>
            <Button
              variant="darkish"
              size="lgExtended"
              onClick={handleAddtools}
              className="mt-3"
            >
              Create Project
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreate;
