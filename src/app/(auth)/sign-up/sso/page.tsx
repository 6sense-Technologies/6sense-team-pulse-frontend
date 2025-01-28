"use client";
import React from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import GoogleLogo from "../../../../../public/logo/googleLogo.svg";
import FacebookLogo from "../../../../../public/logo/facebookLogo.svg";
import AppleLogo from "../../../../../public/logo/appleLogo.svg";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import OrDivider from "../../_components/orDivider";
import FooterTexts from "../../_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";

const SSOSignUp = () => {
  const router = useRouter();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 ">
      <PageTitle pageName='Ops4 Team' title='Create Account - Try Ops4 Team for Free' />
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

          <Link href={"/sign-in"}>
            <Button variant="light" className="text-sm">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-3 md:px-5">
          <div>
            <AuthPageHeader
              title="You are one click away"
              subTitle="from being efficient"
              titleclassName="md:text-2xl text-deepBlackColor"
              subTitleClassName="pt-[4px] pb-[20px]"
            />
          </div>
          <div className="flex gap-x-[34px]">
            <Link href={"/sign-up"}>
              <Button variant="extralight">Password</Button>
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
            <div className="w-full">
              <label htmlFor="name" className="text-black text-sm">
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Type your name"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>
            <div className="w-full pt-3">
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
            <div className="pt-4 w-full">
              <label htmlFor="email" className="text-black font-medium  text-sm">
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Type your password"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>

            <Button variant="dark" className="mt-6 w-full">
              Sign up
            </Button>
          </form>

          <div>
            <p className="text-sm text-textMuted px-10 text-center pt-3">
              By clicking continue, you agree to our{" "}
              <span className="underline cursor-pointer">Terms of Service</span>{" "}
              and {" "}
              <span className="cursor-pointer border-b-[1px] border-subHeading">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOSignUp;
