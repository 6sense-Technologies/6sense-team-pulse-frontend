"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import { useRouter } from "next/navigation";
import FooterTexts from "@/app/(auth)/_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";
import PageTitle from "@/components/PageTitle";
import { BaseInput } from "@/components/BaseInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationSchema } from "../../../../../Zodschema/authSchema";
import { TOrgazinationDetails } from "@/types/Auth.types";
import { useMutation } from "@tanstack/react-query";
import { handleOrganizationDetails } from "../../../../../helpers/Auth/authApi";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader";
import { Circle } from "@phosphor-icons/react";
import SmallLogo from "../../../../../public/logo/Ops4TeamLogo.svg";
const OrganizationDetails = () => {
  const router = useRouter();
  const [orgError, setOrgError] = useState<string>("");
  const domainInputRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TOrgazinationDetails>({
    resolver: zodResolver(OrganizationSchema),
  });
  const { data: session, status, update } = useSession();

  const organizationName = watch("organizationName");

  useEffect(() => {
    if (domainInputRef.current) {
      if (organizationName) {
        const domainValue = organizationName.toLowerCase().replace(/\s+/g, "");
        domainInputRef.current.value = domainValue;
        setValue("domainName", domainValue);
      } else {
        domainInputRef.current.value = "";
        setValue("domainName", "");
      }
    }
  }, [organizationName, setValue]);


  const OrganizationMutation = useMutation({
    mutationFn: (data: TOrgazinationDetails) => handleOrganizationDetails(data, session),
    onSuccess: () => {
      update({ hasOrganization: true }).then(() => {
        router.push("/dashboard");
      });
    },
    onError: (error) => {
      // console.log(error.message);
      if (error.message) {
        setOrgError("Domain must be unique.");
      }
    },
  });

  const handleSubmission: SubmitHandler<TOrgazinationDetails> = (data) => {
    setOrgError("");
    // Convert the domain name to lowercase before submitting
    const updatedData = {
      ...data,
      domainName: data.domainName.toLowerCase(),
    };
    OrganizationMutation.mutate(updatedData);
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "authenticated") {
    if (!session.isVerified && !session.hasOrganization) {
      router.push("/sign-up/verification");
      return <Loader />;
    }
    if (session.isVerified && !session.hasOrganization) {
      router.push("/sign-up/create-organization");
    }
    if (
      session.isVerified &&
      session.hasOrganization &&
      status === "authenticated"
    ) {
      router.push("/dashboard");
      return <Loader />;
    }
  } else if (status === "unauthenticated") {
    router.push("/sign-in");
    return <Loader />;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 ">
      <PageTitle
        pageName="Create Organization"
        title="Try Ops4 Team for Free • Ops4 Team"
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
        <div className="flex justify-center lg:justify-start md:hidden mt-9 mx-4 md:mr-9  md:gap-0">
          <div className="block md:hidden text-center px-3">
            <Image src={SmallLogo} alt="Ops4Team Logo" />
          </div>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-8 pt-6 lg:px-6 lg:pt-0">
          <div>
            <AuthPageHeader
              title="Organization Details"
              subTitle="Provide your organization details to get started"
              titleclassName="text-2xl md:text-2xl text-deepBlackColor pt-[22px]"
              subTitleClassName="text-sm md:text-sm pt-[4px] pb-[20px]"
            />
          </div>
          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className="w-full relative pb-2">
              <label htmlFor="orgName" className="text-black font-medium text-sm">
                Organization Name
              </label>
              <BaseInput
                name="organizationName"
                control={control}
                type="text"
                placeholder="Enter your organization name"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
              {errors.organizationName && (
                <p className=" text-destructive font-medium text-sm absolute pt-2">
                  {errors.organizationName.message}
                </p>
              )}
            </div>
            <div className="w-full pt-6 pb-6 relative">
              <label htmlFor="domain" className="text-black font-medium text-sm">
                Domain
              </label>
              <div className="flex items-center gap-x-[8px] w-full">
                <BaseInput
                  name="domainName"
                  control={control}
                  type="text"
                  placeholder="Domain"
                  className="placeholder:text-subHeading w-full mt-[4px]"
                  ref={domainInputRef}
                />
                <span className="text-sm border text-black bg-lightAquaBg h-9 w-full max-w-[85px] rounded-md py-2 px-2 mt-1 text-center">
                  .ops4.ai
                </span>
              </div>
              {errors.domainName ? (
                <p className="text-destructive  font-medium text-sm absolute pt-2">
                  {errors.domainName.message}
                </p>
              ) : orgError ? (
                <p className="text-destructive font-medium text-sm absolute pt-2">
                  {orgError}
                </p>
              ) : null}
            </div>

            <Button
              variant="submit"
              className="mt-6 bg-primary hover:bg-primary hidden lg:block"
            >
              {OrganizationMutation.isPending ? (
                <Circle className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>

            <Button
              variant="submitExtended"
              className="mt-6 bg-primary hover:bg-primary block lg:hidden"
            >
              {OrganizationMutation.isPending ? (
                <Circle className="animate-spin mx-auto" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;