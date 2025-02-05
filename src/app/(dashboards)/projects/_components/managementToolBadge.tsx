import { Badge } from "@/components/ui/badge";
import React from "react";

type ManagementToolBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

const ManagementToolBadge: React.FC<ManagementToolBadgeProps> = ({
  children,
  className,
}) => {
  return (
    <Badge variant="rounded" className={className}>
      {children}
    </Badge>
  );
};

export default ManagementToolBadge;