import React, { FC } from "react";

type customTypeProps = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const CustomTab: FC<customTypeProps> = ({activeTab,setActiveTab}) => {
  return (
    <div className="tab">
      <div className="flex space-x-4 border-b">
        <button
          className={`py-2 px-4  ${
            activeTab === "profile" ? "border-b-2 border-black font-semibold" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "performance" ? "border-b-2 border-black font-semibold" : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
      </div>
    </div>
  );
};

export default CustomTab;
