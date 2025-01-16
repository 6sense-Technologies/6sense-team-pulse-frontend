import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";

const GrowthDetailsSummary = ({ summary }: { summary: string }) => {
  return (
    <div className="my-4">
      <Alert>
        <AlertTitle>Summary</AlertTitle>
        <AlertDescription>{summary}</AlertDescription>
      </Alert>
    </div>
  );
};

export default GrowthDetailsSummary;