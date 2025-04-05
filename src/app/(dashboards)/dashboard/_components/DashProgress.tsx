import React, { FC } from 'react';
import { Progress } from "@/components/ui/progress";

interface IDashProgressProps {
  teamPercentage?: number;
}

const DashProgress: FC<IDashProgressProps> = ({ teamPercentage }) => {
  return (
    <div className="w-full max-w-[220px]">
      <Progress value={teamPercentage || 0} />
    </div>
  );
};

export default DashProgress;