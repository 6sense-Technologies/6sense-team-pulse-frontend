"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ButtonComponent";
import { Circle} from "lucide-react";
import { ProjectTools } from "@/types/Project.types";
import { useMutation } from "@tanstack/react-query";
import { CreateProject } from "../../../../../helpers/projects/projectApi";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import AvatarMenu from "@/components/AvatarMenu";
import BasicInfoArea from "./_components/BasicInfoArea";
import WorkInfoArea from "./_components/WorkInfoArea";
import AccessControlArea from "./_components/AccessControlArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const InviteMembers = () => {
  const router = useRouter();
  const session = useSession();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ProjectTools>({
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

  const validateURL = (url: string) => {
    const urlRegex = /^https:\/\/((?!-)(?!.*--)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}(\/[^\s]*)?$/;
    return urlRegex.test(url);
  };

  const validate = (data: ProjectTools) => {
    let valid = true;
    if (!data.name) {
      setError("name", {
        type: "manual",
        message: "Project name is required.",
      });
      valid = false;
    } else {
      clearErrors("name");
    }

    data.tools.forEach((tool, index) => {
      if (index === 0) {
        // First pair is mandatory
        if (!tool.toolName) {
          setError(`tools.${index}.toolName`, {
            type: "manual",
            message: "Minimum one tool must be selected.",
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolName`);
        }

        if (!tool.toolUrl) {
          setError(`tools.${index}.toolUrl`, {
            type: "manual",
            message: "Workspace URL is required.",
          });
          valid = false;
        } else if (!validateURL(tool.toolUrl)) {
          setError(`tools.${index}.toolUrl`, {
            type: "manual",
            message: "Invalid URL.",
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolUrl`);
        }
      } else {
        // Subsequent pairs are optional but must be provided together
        if (tool.toolName && !tool.toolUrl) {
          setError(`tools.${index}.toolUrl`, {
            type: "manual",
            message: "Workspace URL is required.",
          });
          valid = false;
        } else if (tool.toolUrl && !validateURL(tool.toolUrl)) {
          setError(`tools.${index}.toolUrl`, {
            type: "manual",
            message: "Invalid URL.",
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolUrl`);
        }

        if (!tool.toolName && tool.toolUrl) {
          setError(`tools.${index}.toolName`, {
            type: "manual",
            message: "Minimum one tool must be selected.",
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolName`);
        }
      }
    });

    return valid;
  };

  const projectMutation = useMutation({
    mutationFn: (data: ProjectTools) => CreateProject(data, session),
    onSuccess: () => {
      router.push("/projects");
    },
    onError: (error) => {
      if (error.message === "Request failed with status code 409") {
        setError("name", {
          type: "manual",
          message: "Project name already exists.",
        });
      }
    }
  });

  const onSubmit = (data: ProjectTools) => {
    if (validate(data)) {
      const filteredData = {
        ...data,
        tools: data.tools.filter(
          (tool) => tool.toolName.trim() !== "" && tool.toolUrl.trim() !== ""
        ),
      };

      projectMutation.mutate(filteredData);
    }
  };

  return (
    <div className="w-full">
      <PageTitle title="Invite Member • Ops4 Team" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4 lg:pl-[24px] lg:pr-[14px] pt-8 pb-8 w-full">
        <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1 "><SidebarTrigger /></span>
          <AvatarMenu />
        </div>
        <div className="flex justify-between items-center">
        <GlobalBreadCrumb
          initialData="Members"
          initalLink="/members"
          secondayData="Invite Member"
          secondayLink="/members/invite"
        />
        <span className="hidden md:flex pr-2">
          <AvatarMenu />
          </span>
        </div>
          <PageHeading title="Invite Member" className="pl-[7px] lg:pl-[5px] pt-1" />

          <div className="flex flex-col items-center lg:flex-row lg:items-start w-full max-w-[872px] pt-4 lg:pt-12 lg:gap-x-[176px]">
            <div className="pl-[6px] py-4 lg:pt-0">
              <Avatar className="w-16 h-16">
              <AvatarImage src="/logo/InviteLogo.svg" alt="Invite Logo" />
                <AvatarFallback className="bg-primary text-white">IL</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full lg:ml-[65px] flex justify-center lg:justify-start">
              <Button
                variant="aquaLight"
                size="lgExtended"
                type="submit"
                className="mt-3 w-full max-w-[132px]"
              >
                Upload Picture
              </Button>
            </div>
          </div>

          <BasicInfoArea
          control={control}
          errors={errors}
          />

          <WorkInfoArea
          control={control}
          errors={errors}
          />

          <AccessControlArea
          control={control}
          errors={errors}
          />

          <div className="mt-16 mb-10 ml-0 lg:ml-[316px] flex-col items-start lg:items-center">
            <div className="w-full">
            <Button
              variant="darkish"
              size="lgExtended"
              type="submit"
              className="mt-3 w-full md:max-w-[70px]"
            >
              {projectMutation.isPending ? (
                <Circle className="animate-spin" size={14} />
              ) : (
                "Invite"
              )}
            </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InviteMembers;