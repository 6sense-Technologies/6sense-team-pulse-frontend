"use client";
import React from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";

import GoogleLogo from "../../../../../public/logo/googleLogo.svg";
import FacebookLogo from "../../../../../public/logo/facebookLogo.svg";
import AppleLogo from "../../../../../public/logo/appleLogo.svg";

import { Input } from "@/components/ui/input";

import OrDivider from "../../_components/orDivider";
import { useRouter } from "next/navigation";
import FooterTexts from "../../_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";
const SSOSignIn = () => {
  const router = useRouter();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 ">
        <PageTitle pageName='Ops4 Team' title='Log in' />
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

          <Link href={"/sign-up"}>
          <Button
            variant="light"
            className="text-sm"
          >
            Sign Up
          </Button>
          </Link>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-3 md:px-5">
        <div>
          <p className="text-3xl text-black font-semibold pb-6">Sign up</p>
            <AuthPageHeader
              title="You are one click away"
              subTitle="from being efficient"
              titleclassName="md:text-2xl text-deepBlackColor pt-6 md:pt-0"
              subTitleClassName="pt-[4px] pb-[20px]"
            />
          </div>
          <div className="flex gap-x-4">
            <Link href={"/sign-in"}>
              <Button variant="extralight" size="minixl">Password</Button>
            </Link>
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
                  width={24}
                  height={24}
                  alt="facebookLogo"
                />
              </Button>
              <Button variant="extralight" size="exSmall">
                <Image
                  src={AppleLogo}
                  width={36}
                  height={36}
                  alt="applelogo"
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
              <label htmlFor="email" className="text-black font-medium  text-sm">
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
              Sign in
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
