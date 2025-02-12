import React from 'react';
import { Info, LucideIcon } from 'lucide-react';

interface GitCardProps {
  icon: LucideIcon;
  heading?: string;
  subheading?: string;
  amount?: number;
  bgColor?: string;
  iconColor?: string;
}

const GitCards: React.FC<GitCardProps> = ({ icon: Icon, subheading, amount, bgColor, iconColor }) => {
  return (
    <div className={`w-full max-w-276px h-[100px] ${bgColor} flex justify-between items-center`}>
      <div>
        <div className="flex items-center gap-x-2 pl-4">
          <span className={iconColor}><Icon size={16} /></span>
          <p className="text-[18px] font-semibold text-deepBlackColor">{amount}</p>
        </div>
        <p className="text-sm text-inputFooterColor pl-4">{subheading}</p>
      </div>
      <div className="pr-4">
        <span><Info size={24} strokeWidth={1} /></span>
      </div>
    </div>
  );
};

export default GitCards;