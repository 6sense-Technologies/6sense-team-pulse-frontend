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

interface WorksheetRemoveModalProps {
  selectedIds: string[];
  worksheetId: string;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const WorksheetRemoveModal: React.FC<WorksheetRemoveModalProps> = ({ selectedIds, setSelectedIds, worksheetId }) => {
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
    onSuccess: () => {
      // Invalidate and refetch the worksheet data
      queryClient.invalidateQueries({ queryKey: ["fetchReportedWorksheet"] });
      setSelectedIds([]);
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
          <AlertDialogTitle>Remove Activity</AlertDialogTitle>
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
