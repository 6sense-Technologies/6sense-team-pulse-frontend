"use client";
import { BaseInput } from "@/components/BaseInput";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ProjectSchema } from "../../../../../Zodschema/projectSchema";
import { Button } from "@/components/ButtonComponent";
import ToolDropdown from "./_components/ToolDropdown";
import WorkspaceURL from "./_components/WorkspaceURL";
import { Trash2 } from "lucide-react";
import { ProjectTools } from "@/types/Project.types";

const ProjectCreate = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectTools>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      tools: [{ toolName: "", toolUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  const handleAddtools = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    append({ toolName: "", toolUrl: "" });
  };

  const onSubmit = (data: any) => {
    console.log(data);
    // Add your form submission logic here
  };

  console.log("Root", errors);
  return (
    <div className="w-full">
      <PageTitle pageName="Ops4 Team" title="Create Project" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pl-[24px] pr-[14px] pt-8 pb-8 w-full">
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
              <label htmlFor="projectName" className="text-sm font-medium text-black">
                Project Name
              </label>
              <BaseInput
                control={control}
                type="text"
                name="name"
                placeholder="Project Name"
                className="placeholder:text-subHeading w-full mt-[4px]"
                additionalText="The project name you used in your code project"
                errors={errors}
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full max-w-[872px]">
            <div className="pl-[6px]">
              <h1 className="text-headingXXS font-semibold pb-1">
                Project Management Tool
              </h1>
            </div>
            <ToolDropdown control={control} name="tools[0].toolName" placeholder="Select" errors={errors.tools?.[0]?.toolName?.message} />
          </div>
          <div className="w-full h-full pl-[320px]">
            <WorkspaceURL control={control} name="tools[0].toolUrl"  errors={errors.tools?.[0]?.toolUrl?.message} />
          </div>

          {fields.slice(1).map((field, index) => (
            <div
              key={field.id}
              className="w-full h-full pl-[320px] flex-col items-center"
            >
              <div className="flex items-end justify-start gap-x-[6px]">
                <ToolDropdown control={control} name={`tools[${index + 1}].toolName`} errors={errors.tools?.[index+1]?.toolName?.message}/>
                <div className="relative border w-10 h-9 rounded-lg">
                  <Trash2
                    className="w-4 h-4 text-black font-normal cursor-pointer absolute top-2 right-3"
                    onClick={() => remove(index + 1)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <WorkspaceURL control={control} name={`tools[${index + 1}].toolUrl`} errors={errors.tools?.[index+1]?.toolUrl?.message}/>
              </div>
            </div>
          ))}

          <div className="mt-14 mb-10 ml-[320px] flex-col items-center">
            <Button
              variant="extralight"
              size="xsExtended"
              onClick={handleAddtools}
              className="mb-6"
            >
              Add Tool
            </Button>
            <Button
              variant="darkish"
              size="lgExtended"
              type="submit"
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