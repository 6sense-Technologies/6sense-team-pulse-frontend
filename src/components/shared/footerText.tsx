import React from "react";

interface TFooterTextProps {
  heading: string;
  subHeading: string;
}

const FooterText = ({ heading, subHeading }: TFooterTextProps) => {
  return (
    <div className="flex flex-col gap-[8px] justify-end pl-[32px] pr-[40px] pb-[32px]">
      <p className="w-full max-w-[410px] text-xl text-lightWhiteColor text-justify">{heading}</p>
      <p className="text-lightWhiteColor text-sm">{subHeading}</p>
    </div>
  );
};

export default FooterText;
