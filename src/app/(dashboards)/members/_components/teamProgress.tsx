import React, { FC } from 'react';
import { Progress } from "@/components/ui/progress";

interface ITeamProgressProps {
  teamPercentage?: number;
}

const TeamProgress: FC<ITeamProgressProps> = ({ teamPercentage }) => {
  return (
    <div className="w-[128px]">
      <Progress value={teamPercentage || 0} />
    </div>
  );
};

export default TeamProgress;