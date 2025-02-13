import React, { useState } from 'react';
import { Info, LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GitCardProps {
  icon: LucideIcon;
  heading?: string;
  subheading?: string;
  amount?: number;
  bgColor?: string;
  iconColor?: string;
  isPercentage?: boolean; // New prop to indicate if the amount is a percentage
  tooltipMessage?:string;
}

const GitCards: React.FC<GitCardProps> = ({ icon: Icon, subheading, amount, bgColor, iconColor, isPercentage,tooltipMessage }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipToggle = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  return (
    <div className={`w-full max-w-276px h-[100px] ${bgColor} flex justify-between items-center`}>
      <div>
        <div className="flex items-center gap-x-2 pl-4">
          <span className={iconColor}><Icon size={16} /></span>
          <p className="text-[18px] font-semibold text-deepBlackColor">
            {amount}{isPercentage ? '%' : ''}
          </p>
        </div>
        <p className="text-sm text-inputFooterColor pl-4">{subheading}</p>
      </div>
      <div className="pr-4">
        <TooltipProvider>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger
              onClick={handleTooltipToggle}
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => setIsTooltipOpen(false)}
              className="p-2 rounded-md"
            >
              <Info size={24} strokeWidth={1} />
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-white w-full max-w-[200px] lg:max-w-[200px] relative right-5">
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default GitCards;