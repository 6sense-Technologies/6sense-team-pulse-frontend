import { Button } from "@/components/ButtonComponent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { RemoveWorksheetData } from "../../../../../../helpers/timelogs/timelogApi";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface PaginationMetadata {
  totalCount: number;
  // Add other pagination fields if needed
}

interface ReportedWorksheetList {
  data: any[]; // Replace 'any' with the actual data type if known
  paginationMetadata: PaginationMetadata;
}

interface WorksheetRemoveModalProps {
  selectedIds: string[];
  worksheetId: string;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  reportedWorksheetList: ReportedWorksheetList; // Adjusted type
}

const WorksheetRemoveModal: React.FC<WorksheetRemoveModalProps> = ({ selectedIds, setSelectedIds, worksheetId, reportedWorksheetList }) => {
  console.log("🚀 ~from worksheet remove modal reportedWorksheetList:", reportedWorksheetList);
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  // const [open, setOpen] = React.useState(false);

  const formatedData = {
    worksheetId: worksheetId,
    activityIds: selectedIds,
  };
  console.log("🚀 ~ formatedData:", formatedData);

  const removeWorksheetMutation = useMutation({
    mutationFn: () => RemoveWorksheetData(formatedData, session),
    onSuccess: async () => {
      // Clear selections immediately
      setSelectedIds([]);

      // Check if we're removing all items from the worksheet
      const isRemovingAll = selectedIds.length >= reportedWorksheetList?.paginationMetadata?.totalCount;

      if (isRemovingAll) {
        // If removing all activities, redirect immediately to timelog
        router.push("/timelog?tab=reported");
        return; // Exit early to avoid unnecessary query invalidation
      }

      queryClient.invalidateQueries({ queryKey: ["fetchReportedWorksheet"] });
      // Optionally, you can also refetch the data to ensure the UI is up-to-date

      // If only removing some activities, refetch and check if any remain
      // await queryClient.invalidateQueries({
      //   queryKey: ["fetchReportedWorksheet"],
      // });

      // // Get latest data after refetch
      // const latestData = queryClient.getQueryData(["fetchReportedWorksheet"]);

      // // If no data is left after the refetch, redirect
      // if (!latestData?.data || latestData.data.length === 0) {
      //   router.push("/timelog?tab=reported");
      // }
    },
    onError: (error) => {
      console.error("Error removing worksheet activities:", error);
    },
  });

  const handleRemove = () => {
    removeWorksheetMutation.mutate();
  };

  return (
    <AlertDialog
    // open={open} onOpenChange={setOpen}
    >
      <AlertDialogTrigger className="border border-errorColor text-errorColor rounded-md px-2 py-1.5">Remove</AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-errorColor">Remove Activity</AlertDialogTitle>
          <AlertDialogDescription>This activity will be removed from the project but kept in Unreported.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-errorColor text-white hover:bg-errorColor"
            onClick={handleRemove}
            disabled={removeWorksheetMutation.isPending}
          >
            {removeWorksheetMutation.isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WorksheetRemoveModal;
