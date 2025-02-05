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
        className="w-full text-left pl-8 pr-2 py-[6px] hover:bg-gray-100"
       
      >
        {firstText}
      </button>
      <button
        className="w-full text-left pl-8 pr-2 py-[6px] hover:bg-gray-100"
        
      >
        {secondText}
      </button>
      <hr className="my-2" />
      <button
        className="w-full text-left pl-8 pr-2 pt-[6px] pb-3 text-destructive hover:bg-gray-100"
       
      >
        {ThirdText}
      </button>
    </div>
  );
};

export default ProjectCustomMenuItems;
