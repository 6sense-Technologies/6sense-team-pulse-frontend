"use client";

import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ButtonComponent";
import { Circle } from "lucide-react";
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
  const [imageUrl, setImageUrl] = useState<string | undefined>("/logo/InviteLogo.svg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<any>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = (data: any) => {
    let valid = true;

    if (!data.displayName) {
      setError("displayName", {
        type: "manual",
        message: "Full name is required.",
      });
      valid = false;
    } else {
      clearErrors("displayName");
    }

    if (!data.emailAddress) {
      setError("emailAddress", {
        type: "manual",
        message: "Email is required.",
      });
      valid = false;
    } else if (!validateEmail(data.emailAddress)) {
      setError("emailAddress", {
        type: "manual",
        message: "Incorrect Email",
      });
      valid = false;
    } else {
      clearErrors("emailAddress");
    }

    if (!data.designation) {
      setError("designation", {
        type: "manual",
        message: "Designation is required.",
      });
      valid = false;
    } else {
      clearErrors("designation");
    }

    if (!data.role) {
      setError("role", {
        type: "manual",
        message: "Role is required.",
      });
      valid = false;
    } else {
      clearErrors("role");
    }

    return valid;
  };

  const projectMutation = useMutation({
    mutationFn: (data: any) => CreateProject(data, session),
    onSuccess: (data) => {
      console.log(data);
      router.push("/projects");
    },
    onError: (error) => {
      if (error.message === "Request failed with status code 409") {
        setError("emailAddress", {
          type: "manual",
          message: "Email already exists.",
        });
      }
    }
  });

  const onSubmit = async (data: any) => {
    if (validate(data)) {
      const formData = {
        ...data,
        profilePicture: imageFile,
      };

      console.log(formData);
      // projectMutation.mutate(formData);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("/logo/InviteLogo.svg");
    setImageFile(null);
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
                <AvatarImage src={imageUrl} alt="Invite Logo" />
                <AvatarFallback className="bg-primary text-white">IL</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full lg:ml-[65px] flex justify-center lg:justify-start">
              {imageUrl === "/logo/InviteLogo.svg" ? (
                <Button
                  variant="aquaLight"
                  size="lgExtended"
                  className="mt-3 w-full max-w-[132px]"
                  type="button"
                >
                  <label htmlFor="upload-picture" className="cursor-pointer">
                    Upload Picture
                    <input
                      id="upload-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="aquaLight"
                    size="lgExtended"
                    className="mt-3 w-full max-w-[132px]"
                    type="button"
                  >
                    <label htmlFor="change-picture" className="cursor-pointer">
                      Change Picture
                      <input
                        id="change-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </Button>
                  <Button
                    variant="destructive"
                    size="lgExtended"
                    className="mt-3 w-full max-w-[132px]"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    Remove Picture
                  </Button>
                </div>
              )}
            </div>
          </div>

          <BasicInfoArea control={control} errors={errors} />

          <WorkInfoArea control={control} errors={errors} />

          <AccessControlArea control={control} errors={errors} />

          <div className="mt-16 mb-10 ml-0 lg:ml-[316px] flex-col items-start lg:items-center">
            <div className="w-full">
              <Button
                variant="darkish"
                size="lgExtended"
                type="submit"
                className="mt-3 w-full md:max-w-[70px]"
              >
                {/* {projectMutation.isPending ? ( */}
                  {/* <Circle className="animate-spin" size={14} /> */}
                {/* ) : ( */}
                  Invite
                {/* )} */}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InviteMembers;