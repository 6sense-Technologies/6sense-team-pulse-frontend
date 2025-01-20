import { Badge } from "@/components/ui/badge";
import React, { FC } from "react";

interface IGHeadingProps {
  title: string;
  subTitle?: string;
  status?: string;
}

const GrowthDetailsPageHeading: FC<IGHeadingProps> = ({ title, subTitle, status }) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <h3 className="text-headingXS md:text-headingBase font-semibold">
          {title}
        </h3>
        <Badge
        className="mt-2"
          variant={
            status === "In Progress"
              ? "in-progress"
              : status === "Completed"
              ? "completed"
              : "todo"
          }
        >
          {status}
        </Badge>
      </div>
      <p className="text-md md:text-base font-semibold text-subHeading">
        {subTitle}
      </p>
    </div>
  );
};

export default GrowthDetailsPageHeading;
