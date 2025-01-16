import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React, { FC } from "react";
import { IconProps } from "@phosphor-icons/react";

interface IGrowthTooltipProps {
    icon: FC<IconProps>;
    tooltipText: string;
    onClick: () => void;
    color?: string;
}

const GrowthTooltip: FC<IGrowthTooltipProps> = ({ icon, tooltipText, onClick, color }) => {
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={onClick}>
            {React.createElement(icon, { size: 18, color })}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default GrowthTooltip;