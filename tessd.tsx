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
        <div className="pl-[24px] pr-[14px] pt-8 w-full">
          <GlobalBreadCrumb
            initialData="Projects"
            initalLink="/projects"
            secondayData="Create"
            secondayLink="/projects/create"
          />
          <PageHeading title="Create Project" className="pl-[5px] pt-3" />

          <div className="flex items-center justify-between w-full max-w-[872px] pt-2">
            <div className="pl-[6px]">
              <h1 className="text-headingXXS font-normal pb-2">Project Info</h1>
            </div>
            <div className="w-full max-w-[553px] pt-10">
              <label htmlFor="name" className="text-sm font-medium text-black">
                Project Name
                <span className="text-errorColor pl-1">*</span>
              </label>
              <BaseInput
                control={control}
                type="text"
                name="name"
                placeholder="Project Name"
                className="placeholder:text-subHeading w-full mt-[6px]"
                additionalText="The project name you used in your code project"
                errors={errors}
              />
            </div>
          </div>

        <div className="flex gap-x-8 items-start mt-20">
            <div className="pl-[6px] w-full max-w-[250px] bg-red-500">
              <h1 className="text-headingXXS font-semibold pb-1">
                Project Management Tool
              </h1>
            </div>
            <div className="w-full">
          {fields.map((field, index) => (
            <div key={field.id} className="w-full h-full flex-col items-center">
              <div className="flex items-end justify-start gap-x-[6px]">
                <ToolDropdown
                  control={control}
                  name={`tools[${index}].toolName`}
                  errors={errors.tools?.[index]?.toolName?.message}
                />
                {index > 0 && (
                  <div className="relative border w-10 h-9 rounded-lg">
                    <Trash2
                      className="w-4 h-4 text-black font-normal cursor-pointer absolute top-2 right-3"
                      onClick={() => remove(index)}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <WorkspaceURL
                  control={control}
                  name={`tools[${index}].toolUrl`}
                  errors={errors.tools?.[index]?.toolUrl?.message}
                />
              </div>
            </div>
           
          ))}
          </div>
          </div>

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