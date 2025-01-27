"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import GoogleLogo from "../../../../public/logo/googleLogo.png";
import FacebookLogo from "../../../../public/logo/facebookLogo.png";
import AppleLogo from "../../../../public/logo/appleLogo.png";
import OrDivider from "../_components/orDivider";
import { redirect, useRouter } from "next/navigation";
import FooterTexts from "../_components/footerTexts";
import AuthPageHeader from "../_components/authPageHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { TBasicSignupFormInputs } from "@/types/Auth.types";
import { SignupSchema } from "../../../../Zodschema/authSchema";
import { useMutation } from "@tanstack/react-query";
import { handleBasicSignup } from "../../../../api/Auth/authApi";
import { BaseInput } from "@/components/BaseInput";
import { Circle } from "@phosphor-icons/react";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import Cookies from "js-cookie";
import { getSession, signIn, useSession } from "next-auth/react";
import Loader from "@/components/loader";

const SignUp = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<TBasicSignupFormInputs>({
    resolver: zodResolver(SignupSchema),
  });
  const session = useSession();

  const basicSignUpMutation = useMutation({
    mutationFn: handleBasicSignup,
    onSuccess: async (data, formData: TBasicSignupFormInputs) => {
      await signIn("credentials", {
        redirect: false,
        emailAddress: formData.emailAddress,
        password: formData.password,
      });
      await session.update();
      localStorage.setItem("user-email", data.userInfo.emailAddress);
      localStorage.setItem("accessToken", data.accessToken);
      router.push("/sign-up/verification");
    },
  });

  const handleSubmission: SubmitHandler<TBasicSignupFormInputs> = (data) => {
    basicSignUpMutation.mutate(data);
  };

  // console.log(session);
 
    if (session.status !== "loading" && session.status === "authenticated") {
      if (!session.data?.isVerified && !session.data?.hasOrganization) {
        router.push("/sign-up/verification");
        return <Loader />;
        
      }
      if (session.data?.isVerified && !session.data?.hasOrganization) {
        router.push("/sign-up/create-organization");
        return <Loader />;
      }
      if (
        session.data?.isVerified &&
        session.data?.hasOrganization &&
        session.status === "authenticated"
      ) {
        router.push("/dashboard");
        return <Loader />;
      }
    }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 ">
      <PageTitle
        pageName="Ops4 Team"
        title="Create Account - Try Ops4 Team for Free"
      />
      <div className="bg-blackishBg w-full  h-screen md:flex md:flex-col md:justify-between hidden">
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

          <Link href="/sign-in">
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
              titleclassName="md:text-2xl text-deepBlackColor pt-6 md:pt-0"
              subTitleClassName="pt-[4px] pb-[20px]"
            />
          </div>
          <div className="flex gap-x-[34px]">
            <Link href={"/sign-up/sso"}>
              <Button variant="extralight">SSO</Button>
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

          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className="w-full">
              <label
                htmlFor="displayName"
                className="text-black font-medium text-sm"
              >
                Name
              </label>
              <BaseInput
                control={control}
                name="displayName"
                errors={errors}
                placeholder="Type your name"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>
            <div className="w-full pt-5">
              <label
                htmlFor="emailAddress"
                className="text-black font-medium  text-sm"
              >
                Email
              </label>
              <BaseInput
                control={control}
                name="emailAddress"
                errors={errors}
                placeholder="Type your email"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>
            <div className="pt-5 w-full">
              <label
                htmlFor="password"
                className="text-black font-medium text-sm"
              >
                Password
              </label>
              <BaseInput
                control={control}
                name="password"
                type="password"
                errors={errors}
                placeholder="Type your password"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>

            <Button variant="dark" className="mt-8 w-full">
              {basicSignUpMutation.isPending ? (
                <Circle className="animate-spin" />
              ) : (
                "Sign up"
              )}
            </Button>
          </form>

          <div>
            <p className="text-sm text-textMuted px-10 text-center pt-3">
              By clicking continue, you agree to our {""}
              <span className="underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer border-b-[1px] border-subHeading">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
