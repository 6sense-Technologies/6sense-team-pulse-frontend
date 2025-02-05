import React, { FC } from "react";

type TProjectCustomMenuItemsProps = {
  firstText: string;
  secondText: string;
  ThirdText: string;
};

const ProjectCustomMenuItems: FC<TProjectCustomMenuItemsProps> = ({
  firstText,
    secondText,
    ThirdText

}) => {
  return (
    <div className="bg-white border rounded-md">
      <button
        disabled
        className="w-full text-left pl-8 pr-2 py-[6px] cursor-not-allowed text-gray-400"
       
      >
        {firstText}
      </button>
      <button
      disabled
        className="w-full text-left pl-8 pr-2 py-[6px] cursor-not-allowed text-gray-400"
        
      >
        {secondText}
      </button>
      <hr className="my-2" />
      <button
      disabled
        className="w-full text-left pl-8 pr-2 pt-[6px] pb-3 cursor-not-allowed text-gray-400" 
       
      >
        {ThirdText}
      </button>
    </div>
  );
};

export default ProjectCustomMenuItems;


//Delete color is text-destructive and hover is bg-gray-100