"use client";
import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../../../public/logo/Ops4TeamLogo.png";
import { Button } from "@/components/ButtonComponent";
import { useRouter } from "next/navigation";
import FooterTexts from "../../_components/footerTexts";
import AuthPageHeader from "../../_components/authPageHeader";

const Verify = () => {
  const router = useRouter();

  const [values, setValues] = useState(Array(6).fill(""));

interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleChange = (e: HandleChangeEvent, index: number) => {
    const newValues = [...values];
    newValues[index] = e.target.value;

    //Autmoatically move logic 
    if (e.target.value && index < 5) {
        const nextInput = document.getElementById(`digit-${index + 1}`);
        if (nextInput) nextInput.focus();
    }

    setValues(newValues);
};

interface HandleKeyDownEvent extends React.KeyboardEvent<HTMLInputElement> {}

const handleKeyDown = (e: HandleKeyDownEvent, index: number) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
        const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement;
        if (prevInput) prevInput.focus();
    }
};

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
              subTitle="We sent a six digit code to pqx1@pxw.com. Enter the code below:"
              titleclassName="text-2xl md:text-2xl text-deepBlackColor pt-[22px]"
              subTitleClassName="text-sm md:text-sm pt-[4px] pb-[20px]"
            />
          </div>

          <form action="">
            <div className="w-full">
              <label htmlFor="otp" className="text-black font-medium text-sm">
                One-Time Password
              </label>
              <div className="flex mt-4">
                {values.map((value, index) => (
                  <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-10 h-10 text-center text-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      index === 0 ? "rounded-l-md" : ""
                    } ${index === 5 ? "rounded-r-md" : ""}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-textMuted pt-3 text-start">
                Didn't receive an email? Try checking your junk folder.
              </p>
              <p className="text-sm text-deepBlackColor font-medium underline pt-1">
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
