"use client";
import React from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";


import GoogleLogo from "../../../../../public/logo/googleLogo.png";
import FacebookLogo from "../../../../../public/logo/facebookLogo.png";
import AppleLogo from "../../../../../public/logo/appleLogo.png";

import { Input } from "@/components/ui/input";

import OrDivider from "../../_components/orDivider";
import { useRouter } from "next/navigation";
import FooterTexts from "../../_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";
const SSOSignIn = () => {
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
      <div className="bg-white w-full">
        <div className="flex justify-between md:justify-end mt-9 mx-4 md:mr-9  md:gap-0">
          <div className="block md:hidden bg-black text-center px-3">
            <Image src={Logo} alt="Ops4Team Logo" />
          </div>

          <Button
            variant="light"
            className="text-sm"
            onClick={() => router.push("/signUp")}
          >
            Sign Up
          </Button>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-3 md:px-5">
          <div>
            <AuthPageHeader
              title="You are one click away"
              subTitle="from being efficient"
              titleclassName="md:text-2xl text-deepBlackColor pt-[32px]"
              subTitleClassName="pt-[4px] pb-[24px]"
            />
          </div>
          <div className="flex gap-x-[34px]">
            <Button variant="extralight" onClick={() => router.push("/signIn")}>
              Password
            </Button>
            <div className="flex gap-x-[16px]">
              <Button variant="extralight" size="smallest">
                <Image
                  src={GoogleLogo}
                  width={24}
                  height={24}
                  alt="googleLogo"
                />
              </Button>
              <Button variant="extralight" size="smallest">
                <Image
                  src={FacebookLogo}
                  width={18}
                  height={18}
                  alt="facebookLogo"
                />
              </Button>
              <Button variant="extralight" size="smallest">
                <Image
                  src={AppleLogo}
                  width={24}
                  height={24}
                  alt="facebookLogo"
                />
              </Button>
            </div>
          </div>
          <OrDivider
            text="OR CONTINUE WITH"
            className="text-[12px] text-textMuted"
          />

          <form action="">
            <div className="w-full pt-2">
              <label htmlFor="email" className="text-black text-sm">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Type your email"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>

            <Button variant="dark" className="mt-8 w-full">
              Sign In
            </Button>
          </form>

          <div>
            <p className="text-sm text-textMuted px-10 text-center pt-5">
              By clicking continue, you agree to our{" "}
              <span className="underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOSignIn;
