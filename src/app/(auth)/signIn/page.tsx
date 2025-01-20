import React from "react";
import Image from "next/image";
import Logo from "../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import FooterTexts from "./_components/footerTexts";
import PageHeading from "@/components/pageHeading";

const SignIn = () => {
  return (
    <div className="w-full flex ">
      <div className="bg-blackishBg w-full h-screen max-w-[640px] flex flex-col justify-between">
        <div className="pl-[36px] pt-[36px]">
          <Image src={Logo} alt="Ops4Team Logo" />
        </div>
        <FooterTexts
          heading="“This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before.”"
          subHeading="Sofia Davis"
        />
      </div>
      <div className="bg-white w-full pl-[88px] max-w-[800px]">
        <div className="flex justify-end mt-[36px] mr-[36px]">
          <Button variant="light" className="text-sm">
            Sign Up
          </Button>
        </div>
        <div>
          <PageHeading
            title="You are one click away"
            subTitle="from being efficient"
            titleclassName="text-xl text-deepBlackColor pt-[32px]"
            subTitleClassName="pt-[8px] pb-[24px]"
          />
        </div>
        <div className="flex gap-x-[34px]">
          <Button>SSO</Button>
          <div className="flex ">
          <Button>SSO</Button>
          <Button>SSO</Button>
          <Button>SSO</Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SignIn;
