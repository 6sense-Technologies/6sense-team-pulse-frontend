import Link from "next/link";
import React, { FC } from "react";

type TProjectCustomMenuItemsProps = {
  firstText: string;
  secondText: string;
  ThirdText: string;
  projectId: string;
};

const ProjectCustomMenuItems: FC<TProjectCustomMenuItemsProps> = ({ firstText, secondText, ThirdText, projectId }) => {
  console.log("🚀 ~ projectId:", projectId);
  return (
    <div className="bg-white border rounded-md">
      <Link href={`/projects/${projectId}`}>
        <button className="w-full text-left pl-8 pr-2 py-[6px]">{firstText}</button>
      </Link>

      <button disabled className="w-full text-left pl-8 pr-2 py-[6px] cursor-not-allowed text-gray-500">
        {secondText}
      </button>
      <hr className="my-2" />
      <button disabled className="w-full text-left pl-8 pr-2 pt-[6px] pb-3 cursor-not-allowed text-gray-500">
        {ThirdText}
      </button>
    </div>
  );
};

export default ProjectCustomMenuItems;

//Delete color is text-destructive and hover is bg-gray-100
