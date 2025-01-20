"use client";
import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import FooterTexts from "@/app/(auth)/_components/footerTexts";
import AuthPageHeader from "../_components/authPageHeader";

const OrganizationDetails = () => {
  const router = useRouter();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 ">
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
          <form action="">
            <div className="w-full">
              <label htmlFor="orgName" className="text-black text-sm">
                Organization Name
              </label>
              <Input
                type="text"
                id="orgName"
                placeholder="Type your organization name"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>
            <div className="w-full pt-3">
              <label htmlFor="domain" className="text-black text-sm">
                Domain
              </label>
              <div className="flex items-center gap-x-[8px]">
              <Input
                type="text"
                id="domain"
                placeholder="Type your domain prefix"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
                <span className="text-sm border text-subHeading bg-lightAquaBg h-9 w-full max-w-[120px] rounded-md py-2 px-2 mt-1">@ops4team.com</span>
              </div>
            </div>

            <Button variant="submit" className="mt-6">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
