"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import { useRouter } from "next/navigation";
import FooterTexts from "../../_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";
import PageTitle from "@/components/PageTitle";
import { SubmitHandler, useForm } from "react-hook-form";
import { TVerifyEmail } from "@/types/Auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailSchema } from "../../../../../Zodschema/authSchema";
import Otpfields from "./_components/otpfields";
import { useMutation } from "@tanstack/react-query";
import { handleOtp, handleResendOTP } from "../../../../../api/Auth/authApi";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader";

const Verify = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("user-email");
    setUserEmail(email);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TVerifyEmail>({
    resolver: zodResolver(VerifyEmailSchema),
  });

  const { data: session, status, update } = useSession();

  const otpMutation = useMutation({
    mutationFn: handleOtp,
    onSuccess: (data) => {
      update({ isVerified: data.isValidated }).then(() => {
        router.push("/sign-up/create-organization");
      });
    },
  });

  const handleSubmission: SubmitHandler<TVerifyEmail> = (data) => {
    const email = userEmail || "";
    const payload = {
      email,
      token: data.otp,
    };
    otpMutation.mutate(payload);
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "authenticated") {
    if (!session.isVerified && !session.hasOrganization) {
      router.push("/sign-up/verification");
      // return <Loader />;
    }
    if (session.isVerified && !session.hasOrganization) {
      router.push("/sign-up/create-organization");
      return <Loader />;
    }
    if (session.isVerified && session.hasOrganization) {
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
        pageName="Ops4 Team"
        title="Verify Account - Try Ops4 Team for Free"
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
              title="Verify Email"
              subTitle={`We sent a six digit code to ${userEmail} Enter the code below:`}
              titleclassName="text-2xl md:text-2xl text-deepBlackColor pt-[22px]"
              subTitleClassName="text-sm md:text-sm pt-[4px] pb-[20px]"
            />
          </div>

          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className="w-full relative">
              <label htmlFor="otp" className="text-black font-medium text-sm">
                One-Time Password
              </label>
              <div className="flex mt-4">
                <Otpfields control={control} />
              </div>
              <p className="text-sm text-errorColor absolute pt-2">
                {errors.otp && "OTP incorrect"}
              </p>
            </div>

            <div>
              <p className="text-sm text-textMuted pt-11 text-start">
                Didn't receive an email? Try checking your junk folder.
              </p>
              <p
                className="text-sm text-deepBlackColor font-medium underline pt-1 cursor-pointer"
                onClick={() => handleResendOTP(userEmail || "")}
              >
                Resend
              </p>
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

export default Verify;