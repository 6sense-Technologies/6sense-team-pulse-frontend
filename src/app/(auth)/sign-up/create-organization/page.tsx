"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";
import FooterTexts from "@/app/(auth)/_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";
import PageTitle from "@/components/PageTitle";
import { BaseInput } from "@/components/BaseInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationSchema } from "../../../../../Zodschema/authSchema";
import { TOrgazinationDetails } from "@/types/Auth.types";
import { useMutation } from "@tanstack/react-query";
import { handleOrganizationDetails } from "../../../../../api/Auth/authApi";
import { signIn, signOut, useSession } from "next-auth/react";
import Loader from "@/components/loader";

const OrganizationDetails = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TOrgazinationDetails>({
    resolver: zodResolver(OrganizationSchema),
  });
  const { data: session, status, update } = useSession();
  localStorage.setItem("accessToken", session?.accessToken as string);

  const OrganizationMutation = useMutation({
    mutationFn: handleOrganizationDetails,
    onSuccess: async (data) => {
      await update({ hasOrganization: true });
      router.push("/dashboard");
    },
  });

  const handleSubmission: SubmitHandler<TOrgazinationDetails> = (data) => {
    // console.log(data);
    OrganizationMutation.mutate(data);
  };


    if (status !== "loading" && status === "authenticated") {
      if (!session.isVerified && !session.hasOrganization) {
        router.push("/sign-up/verification");
        return <Loader />;
      }
      if (session.isVerified && !session.hasOrganization) {
        router.push("/sign-up/create-organization");
        // return <Loader />;
      }
      if (
        session.isVerified &&
        session.hasOrganization &&
        status === "authenticated"
      ) {
        router.push("/dashboard");
        return <Loader />;
      }
    } 
    else if (status === "unauthenticated") {
      router.push("/sign-in");
      return <Loader />;
    }


  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 ">
      <PageTitle
        pageName="Ops4 Team"
        title="Create Organization - Try Ops4 Team for Free"
      />
      <div className="bg-blackishBg w-full h-screen md:flex md:flex-col md:justify-between hidden">
        <div className="pl-[36px] pt-[36px]">
          <Image src={Logo} alt="Ops4Team Logo" />
        </div>
        <FooterTexts
          heading="“This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before.”"
          subHeading="Sofia Davis"
        />
      </div>
      <div className="bg-white w-full my-auto">
        <div className="flex justify-start md:hidden mt-9 mx-4 md:mr-9  md:gap-0">
          <div className="block md:hidden bg-black text-center px-3">
            <Image src={Logo} alt="Ops4Team Logo" />
          </div>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-3 md:px-6">
          <div>
            <AuthPageHeader
              title="Organization Details"
              subTitle="Provide your organization details to get started"
              titleclassName="text-2xl md:text-2xl text-deepBlackColor pt-[22px]"
              subTitleClassName="text-sm md:text-sm pt-[4px] pb-[20px]"
            />
          </div>
          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className="w-full">
              <label htmlFor="orgName" className="text-black text-sm">
                Organization Name
              </label>
              <BaseInput
                name="organizationName"
                control={control}
                type="text"
                placeholder="Type your organization name"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
              {errors.organizationName && (
                <p className="text-red-500 text-sm">
                  {errors.organizationName.message}
                </p>
              )}
            </div>
            <div className="w-full pt-3">
              <label htmlFor="domain" className="text-black text-sm">
                Domain
              </label>
              <div className="flex items-center gap-x-[8px]">
                <BaseInput
                  name="domainName"
                  control={control}
                  type="text"
                  placeholder="Type your domain prefix"
                  className="placeholder:text-subHeading w-full mt-[4px]"
                />
                <span className="text-sm border text-subHeading bg-lightBlueBg h-9 w-full max-w-[85px] rounded-md py-2 px-2 mt-1 text-center">
                  .ops4.ai
                </span>
              </div>
              {errors.domainName && (
                <p className="text-red-500 text-sm">
                  {errors.domainName.message}
                </p>
              )}
            </div>

            <Button type="submit" variant="submit" className="mt-6">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
