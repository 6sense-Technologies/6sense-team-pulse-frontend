"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import SmallLogo from "../../../../../public/logo/Ops4TeamLogo.svg";
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
import { handleOtp, handleResendOTP } from "../../../../../helpers/Auth/authApi";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader";
import { Circle } from "@phosphor-icons/react";

const Verify = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(VerifyEmailSchema),
  });

  const { data: session, status, update } = useSession();

  useEffect(() => {
    const email = localStorage.getItem("user-email");
    setUserEmail(email);

    const endTime = localStorage.getItem("endTime");
    const otpExpired = localStorage.getItem("otpExpired");

    if (otpExpired === "true") {
      setIsExpired(true);
      setTimeLeft(0);
    } else if (endTime) {
      const remaining = Math.floor((parseInt(endTime, 10) - Date.now()) / 1000);
      if (remaining > 0) setTimeLeft(remaining);
      else {
        setIsExpired(true);
        setTimeLeft(0);
        localStorage.setItem("otpExpired", "true");
      }
    } else {
      localStorage.setItem("endTime", (Date.now() + timeLeft * 1000).toString());
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          setIsExpired(true);
          localStorage.setItem("otpExpired", "true");
          localStorage.removeItem("endTime");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const resetTimer = () => {
    setTimeLeft(120);
    setIsExpired(false);
    const end = Date.now() + 120 * 1000;
    localStorage.setItem("endTime", end.toString());
    localStorage.setItem("otpExpired", "false");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const otpMutation = useMutation({
    mutationFn: handleOtp,
    onSuccess: (data) => {
      update({ isVerified: data.isValidated }).then(() => {
        router.push("/sign-up/create-organization");
        localStorage.removeItem("endTime");
      });
    },
    onError: () => {
      setVerifyError("Incorrect OTP.");
    },
  });

  interface OnSubmitData {
    token: string;
  }

  const onSubmit: SubmitHandler<OnSubmitData> = (data) => {
    setVerifyError(null);
    const email: string = userEmail || "";
    otpMutation.mutate({ email, token: data.token });
  };

  const handleResend = () => {
    if (userEmail) {
      handleResendOTP(userEmail);
      resetTimer();
      reset({ token: "" });
      setVerifyError(null);
    }
  };

  if (status === "loading") return <Loader />;

  if (status === "authenticated") {
    if (!session?.isVerified && !session?.hasOrganization) router.push("/sign-up/verification");
    else if (session?.isVerified && !session?.hasOrganization) return router.push("/sign-up/create-organization"), (<Loader />);
    else if (session?.isVerified && session?.hasOrganization) return router.push("/dashboard"), (<Loader />);
  } else if (status === "unauthenticated") {
    router.push("/sign-in");
    return <Loader />;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <PageTitle pageName="Verify Account" title="Try Ops4 Team for Free • Ops4 Team" />

      <div className="bg-blackishBg w-full h-screen md:flex md:flex-col md:justify-between hidden">
        <div className="pl-[36px] pt-[36px]">
          <Image src={Logo} alt="Ops4Team Logo" />
        </div>
        <FooterTexts
          heading="“This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.”"
          subHeading="Sofia Davis"
        />
      </div>

      <div className="bg-white w-full my-auto">
        <div className="flex justify-center md:hidden mt-9 mx-4">
          <div className="px-3">
            <Image src={SmallLogo} alt="Ops4Team Logo" />
          </div>
        </div>

        <div className="max-w-[465px] mx-auto px-8 pt-6">
          <AuthPageHeader
            title="Verify Email"
            subTitle={`We sent a six digit code to ${userEmail}. Enter the code below:`}
            titleclassName="text-2xl text-deepBlackColor pt-[22px]"
            subTitleClassName="text-sm pt-[4px] pb-[20px]"
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full pt-6">
              <label htmlFor="otp" className="text-black font-medium text-sm">
                One-Time Password
              </label>
              <div className="flex mt-4">
                <Otpfields control={control} />
              </div>

              <div className="flex justify-between items-center max-w-[310px]">
                <p className="text-sm text-destructive font-medium pt-2">
                  {isExpired ? "OTP is expired." : errors.token?.message || verifyError || ""}
                </p>
                <p className="text-sm text-textMuted pt-2">{formatTime(timeLeft)}</p>
              </div>
            </div>

            <p className="text-sm text-textMuted pt-4">Didn&apos;t receive an email? Try checking your junk folder.</p>
            {isExpired && (
              <p className="text-sm text-deepBlackColor font-medium underline pt-1 cursor-pointer" onClick={handleResend}>
                Resend
              </p>
            )}

            <Button variant="submit" className="mt-6 bg-primary hidden lg:block">
              {otpMutation.isPending ? <Circle className="animate-spin" /> : "Submit"}
            </Button>

            <Button variant="submitExtended" className="mt-6 bg-primary block lg:hidden">
              {otpMutation.isPending ? <Circle className="animate-spin mx-auto" /> : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verify;
