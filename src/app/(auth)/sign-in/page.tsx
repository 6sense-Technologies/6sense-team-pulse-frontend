import AuthPageHeader from "@/components/shared/authPageHeader";
import FooterText from "@/components/shared/footerText";
import OrDivider from "@/components/shared/orDivider";
import PageTitle from "@/components/shared/pageTitle";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignInPage = () => {
  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 overflow-y-hidden">
      <PageTitle title="Log in • Ops4 Team" />
      <div className="bg-blackishBg w-full md:flex md:flex-col md:justify-between hidden border bg-primary text-white">
        <div className="pl-[36px] pt-[36px]">{/* <Image src={Logo} alt="Ops4Team Logo" /> */}</div>
        <FooterText
          heading="“This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before.”"
          subHeading="Sofia Davis"
        />
      </div>
      <div className="bg-white w-full overflow-y-auto pb-4">
        {/* <Toaster /> */}
        <div className="lg:flex lg:justify-end mt-9 mx-4 mr-9 lg:gap-0">
          <div className="flex justify-center md:hidden px-3">{/* <Image src={SmallLogo} alt="Ops4Team Logo" /> */}</div>

          <Link href={"/sign-up"}>
            <Button className="text-sm hidden lg:block">Sign up</Button>
          </Link>
        </div>

        <div className="w-full max-w-[465px] mx-auto px-8 pt-6 xl:pt-8 lg:px-5 lg:pt-0">
          <p className="text-3xl text-black font-semibold pt-4 lg:pt-0">Sign in</p>
          <div>
            <AuthPageHeader
              title="You are one click away"
              subTitle="from being efficient"
              titleClassName="md:text-2xl pt-6"
              subTitleClassName="pt-1 pb-6"
            />
          </div>
          <div className="flex gap-x-4">
            {/* <Link href={"/sign-in/sso"}> */}
            <Button
            // onClick={() => comingSoonAlert()}
            >
              SSO
            </Button>
            {/* </Link> */}
            <div className="flex gap-x-[16px]">
              <Button>{/* <Image src={GoogleLogo} width={24} height={24} alt="googleLogo" /> */}</Button>
              <Button>{/* <Image src={FacebookLogo} width={24} height={24} alt="facebookLogo" /> */}</Button>
              <Button>{/* <Image src={AppleLogo} width={24} height={24} alt="appleLogo" /> */}</Button>
            </div>
          </div>
          <OrDivider text="OR CONTINUE WITH" className="text-[12px] text-textMuted" />

          {/* <form onSubmit={handleSubmit(handleSubmission)}>
            <div className="w-full pt-2 lg:pt-0">
              <label htmlFor="email" className="text-black font-medium text-sm">
                Email
              </label>
              <BaseInput
                type="email"
                control={control}
                name="emailAddress"
                errors={errors}
                placeholder="Enter your email"
                className="placeholder:text-subHeading w-full mt-[4px]"
                externalError={errorMessage}
              />
            </div>
            <div className="pt-6 lg:pt-5 w-full">
              <label htmlFor="password" className="text-black font-medium text-sm">
                Password
              </label>
              <div className="relative">
                <div className="mt-[4px]">
                  <BaseInput
                    control={control}
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    errors={errors}
                    className="placeholder:text-subHeading w-full mt-[4px]"
                  />
                  <button type="button" onClick={handlePasswordVisibility} className="absolute right-5 top-2.5">
                    {passwordVisible ? (
                      <Eye size={20} className="text-xl text-deepBlackColor" />
                    ) : (
                      <EyeOff size={20} className="text-xl text-deepBlackColor" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {errorFlag ? <InvalidErrorBanner /> : null}

            <Button variant="dark" className={`${errorFlag ? "mt-2 w-full" : "mt-8 w-full"}`}>
              {BasicSignInMutation.isPending ? <Circle className="animate-spin" /> : "Sign in"}
            </Button>
          </form> */}

          <div className="block lg:hidden mt-4">
            <Link href={"/sign-up"}>
              <Button className="text-sm w-full">Sign up</Button>
            </Link>
          </div>

          <div>
            <p className="text-sm text-textMuted px-10 text-center pt-5">
              By clicking continue, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
