"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import GoogleLogo from "../../../../public/logo/googleLogo.svg";
import FacebookLogo from "../../../../public/logo/facebookLogo.svg";
import AppleLogo from "../../../../public/logo/appleLogo.svg";
import OrDivider from "../_components/orDivider";
import { useRouter } from "next/navigation";
import FooterTexts from "../_components/footerTexts";
import AuthPageHeader from "../_components/authPageHeader";
import { TBasicSignInFormInputs } from "@/types/Auth.types";
import { LoginSchema } from "../../../../Zodschema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { BaseInput } from "@/components/BaseInput";
import { Circle } from "@phosphor-icons/react";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import Loader from "@/components/loader";
import InvalidErrorBanner from "./_components/invalidErrorBanner";

const SignIn = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<TBasicSignInFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const session = useSession();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorFlag, setErrorFlag] = useState<boolean>(false);

  const BasicSignInMutation = useMutation({
    mutationFn: async (data: TBasicSignInFormInputs) => {
      const result = await signIn("credentials", {
        redirect: false,
        emailAddress: data.emailAddress,
        password: data.password,
      });

      if (result?.code) {
        throw new Error(result.code);
      }
      return result;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.log("Error:", error.message);
      if (error.message === "User not found") {
        setErrorMessage("No account found with this email.");
        setErrorFlag(false);
      }
      if (error.message === "Invalid credentials") {
        setErrorFlag(true);
      }
    },
  });

  const handleSubmission: SubmitHandler<TBasicSignInFormInputs> = (data) => {
    setErrorMessage(null);
    BasicSignInMutation.mutate(data, {
      onSuccess: () => {
        signIn("credentials", {
          redirect: false,
          emailAddress: data.emailAddress,
          password: data.password,
        }).then(() => {
          localStorage.setItem("user-email", data.emailAddress);
          localStorage.setItem(
            "accessToken",
            session.data?.accessToken as string
          );
          router.push("/dashboard");
        });
      },
    });
  };

  if (session.status === "loading") return <Loader />;

  if (session.status === "authenticated") {
    if (!session.data?.isVerified && !session.data?.hasOrganization) {
      // router.push("/sign-up/verification");
      signOut({ redirect: false }).then(() => {
        return <Loader />;
      });
    }
    if (session.data?.isVerified && !session.data?.hasOrganization) {
      signOut({ redirect: false }).then(() => {
        return <Loader />;
      });
    } else if (
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
      <PageTitle title="Log in • Ops4 Team" />
      <div className="bg-blackishBg w-full md:flex md:flex-col md:justify-between hidden">
        <div className="pl-[36px] pt-[36px]">
          <Image src={Logo} alt="Ops4Team Logo" />
        </div>
        <FooterTexts
          heading="“This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before.”"
          subHeading="Sofia Davis"
        />
      </div>
      <div className="bg-white w-full overflow-y-auto pb-4">
        <div className="flex justify-between md:justify-end mt-9 mx-4 md:mr-9  md:gap-0">
          <div className="block md:hidden bg-black text-center px-3">
            <Image src={Logo} alt="Ops4Team Logo" />
          </div>

          <Link href={"/sign-up"}>
            <Button variant="light" className="text-sm">
              Sign up
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-3 md:px-5">
          <p className="text-3xl text-black font-semibold pt-4 md:pt-0">
            Sign in
          </p>
          <div>
            <AuthPageHeader
              title="You are one click away"
              subTitle="from being efficient"
              titleclassName="md:text-2xl text-deepBlackColor pt-6"
              subTitleClassName="pt-[4px] pb-[24px]"
            />
          </div>
          <div className="flex gap-x-4">
            <Link href={"/sign-in/sso"}>
              <Button variant="extralight" size="minixl">
                SSO
              </Button>
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
                <Image src={AppleLogo} width={24} height={24} alt="appleLogo" />
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
                htmlFor="email"
                className="text-black font-medium  text-sm"
              >
                Email
              </label>
              <BaseInput
                control={control}
                name="emailAddress"
                errors={errors}
                placeholder="Enter your email"
                className="placeholder:text-subHeading w-full mt-[4px]"
                externalError={errorMessage}
              />
            </div>
            <div className="pt-5 w-full">
              <label
                htmlFor="password"
                className="text-black font-medium  text-sm"
              >
                Password
              </label>
              <BaseInput
                control={control}
                type="password"
                name="password"
                errors={errors}
                placeholder="Enter your password"
                className="placeholder:text-subHeading w-full mt-[4px]"
              />
            </div>

            {errorFlag ? <InvalidErrorBanner /> : null}

            <Button
              variant="dark"
              className={`${errorFlag ? "mt-2 w-full" : "mt-8 w-full"}`}
            >
              {BasicSignInMutation.isPending ? (
                <Circle className="animate-spin" />
              ) : (
                "Sign in"
              )}
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

export default SignIn;
