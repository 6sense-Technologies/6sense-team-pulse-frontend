"use client";
import React, {useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import GoogleLogo from "../../../../public/logo/googleLogo.svg";
import FacebookLogo from "../../../../public/logo/facebookLogo.svg";
import AppleLogo from "../../../../public/logo/appleLogo.svg";
import OrDivider from "../_components/orDivider";
import {useRouter } from "next/navigation";
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
import {signIn, useSession } from "next-auth/react";
import Loader from "@/components/loader";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TBasicSignupFormInputs>({
    resolver: zodResolver(SignupSchema),
  });
  const session = useSession();

  const basicSignUpMutation = useMutation({
    mutationFn: handleBasicSignup,
    onSuccess: (data, formData: TBasicSignupFormInputs) => {
      signIn("credentials", {
        redirect: false,
        emailAddress: formData.emailAddress,
        password: formData.password,
      }).then(() => {
        session.update().then(() => {
          localStorage.setItem("user-email", data.userInfo.emailAddress);
          localStorage.setItem("accessToken", data.accessToken);
          router.push("/sign-up/verification");
        });
      });
    },
    onError: (error: any) => {
      console.log(error.message);
      if (error.message) {
        setErrorMessage("Email already exists.");
      }
    },
  });

  const handleSubmission: SubmitHandler<TBasicSignupFormInputs> = (data) => {
    setErrorMessage(null);
    basicSignUpMutation.mutate(data);
  };

  if (session.status === "loading") {
    return <Loader />;
  }

  if (session.status === "authenticated") {
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
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 overflow-y-hidden">
      <PageTitle
        pageName="Create Account"
        title="Try Ops4 Team for Free • Ops4 Team"
      />
      <div className="bg-blackishBg w-full  md:flex md:flex-col md:justify-between hidden">
        <div className="pl-[36px] pt-[36px]">
          <Image src={Logo} alt="Ops4Team Logo" />
        </div>
        <FooterTexts
          heading="“This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before.”"
          subHeading="Sofia Davis"
        />
      </div>
      <div className="bg-white w-full overflow-y-auto">
        <div className="flex justify-between md:justify-end mt-9 mx-4 md:mr-9  md:gap-0">
          <div className="block md:hidden bg-black text-center px-3">
            <Image src={Logo} alt="Ops4Team Logo" />
          </div>

          <Link href="/sign-in">
            <Button variant="light" className="text-sm">
              Sign in
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-3 md:px-5 pb-5">
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
            <Link href={"/sign-up/sso"}>
              <Button variant="extralight" size="minixl">SSO</Button>
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
              <Button variant="extralight" size="smallest">
                <Image
                  src={AppleLogo}
                  width={24}
                  height={24}
                  alt="applelogo"
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
                Full Name
              </label>
              <BaseInput
                control={control}
                name="displayName"
                errors={errors}
                placeholder="Enter your full name"
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
                type="email"
                control={control}
                name="emailAddress"
                errors={errors}
                externalError={errorMessage}
                placeholder="Enter your email"
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
              <div className="relative">
        <BaseInput
          control={control}
          name="password"
          type={passwordVisible ? 'text' : 'password'}
          errors={errors}
          placeholder="Password"
          className="placeholder:text-subHeading w-full mt-[4px]"
        />
        <button
          type="button"
          onClick={handlePasswordVisibility}
          className="absolute right-5 top-2.5"
        >
          {passwordVisible ? (
            <Eye
              size={20}
              className="text-xl text-deepBlackColor"
            />
          ) : (
            <EyeOff
              size={20}
              className="text-xl text-deepBlackColor font-normal"
            />
          )}
        </button>
      </div>
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
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;