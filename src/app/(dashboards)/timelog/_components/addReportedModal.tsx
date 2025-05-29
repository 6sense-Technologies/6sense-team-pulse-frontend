"use client";

import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ButtonComponent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateReportedData, GetProjectList, GetWorksheetList } from "../../../../../helpers/timelogs/timelogApi";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Project {
  _id: string;
  name: string;
}

interface WorkSheet {
  _id: string;
  name: string;
  totalActivities: number;
  totalLoggedTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface SearchResults {
  worksheets: WorkSheet[];
  loading: boolean;
}

interface AddReportedModalProps {
  date: string;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  onSuccess?: () => void;
  activeTab: "unreported" | "reported";
}

const AddReportedModal = ({ date, selectedIds, setSelectedIds, onClose, onSuccess, activeTab }: AddReportedModalProps) => {
  const session = useSession();
  const form = useForm();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    worksheets: [],
    loading: false,
  });
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  console.log("🚀 ~ AddReportedModal ~ openPopover:", openPopover);
  const [selectedWorksheet, setSelectedWorksheet] = useState<WorkSheet | null>(null);
  const [shouldSkipFocus, setShouldSkipFocus] = useState(false);

  const projectId = form.watch("project");

  const {
    formState: { isSubmitting },
  } = form;

  const { data: projectsList } = useQuery<Project[]>({
    queryKey: ["fetchProjects"],
    queryFn: () => GetProjectList(session),
  });

  const handleSearch = (query: string) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only search if we have 3+ characters and a project ID
    if (query.length >= 3 && projectId) {
      // Set loading state
      setSearchResults({ worksheets: [], loading: true });

      // Set a new timeout for debouncing
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const worksheetData = await GetWorksheetList(
            {
              projectId,
              worksheetName: query,
              formattedDate: date,
            },
            session,
          );

          setSearchResults({
            worksheets: worksheetData || [],
            loading: false,
          });
          setOpenPopover(true);
        } catch (error) {
          console.error("Error fetching worksheets:", error);
          setSearchResults({ worksheets: [], loading: false });
        }
      }, 300);
    } else {
      setOpenPopover(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup the timeout on unmount
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const reportedMutation = useMutation({
    mutationFn: (data: any) => CreateReportedData(data, session),
    onSuccess: () => {
      toast({
        title: "Activity added to worksheet!",
        description: "Your project has been created successfully.",
      });
      setOpen(false);
      form.reset();
      setSelectedWorksheet(null);
      queryClient.invalidateQueries({ queryKey: ["fetchTimelogs"] });
      onClose();
      onSuccess?.();
      setSelectedIds([]); // This is fine here
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const payload = {
      projectId: data.project,
      worksheetName: data.workSheetName,
      date: date,
      activityIds: selectedIds,
    };

    reportedMutation.mutate(payload);
  };

  const handleWorksheetSelect = (worksheet: WorkSheet, field: any) => {
    field.onChange(worksheet.name);
    setSelectedWorksheet(worksheet);
    setSearchQuery(worksheet.name);
    setOpenPopover(false);
    setShouldSkipFocus(true);

    // Use setTimeout to ensure the focus is skipped after the current event loop
    setTimeout(() => {
      setShouldSkipFocus(false);
    }, 100);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogTrigger asChild>
        {activeTab === "unreported" && (
          <Button className="mt-4 md:mt-0" variant="defaultEx">
            Assign to Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl leading-6">Work Sheet</DialogTitle>
          <DialogDescription className="text-[#64748B] font-normal text-sm leading-5">
            Group selected activities into a worksheet and assign it to a project in one go.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Project Select */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Project <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedWorksheet(null);
                      setSearchQuery("");
                      form.setValue("workSheetName", "");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 !border-none !outline-none">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {projectsList?.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Worksheet Input */}
            <FormField
              control={form.control}
              name="workSheetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Work Sheet Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        ref={inputRef}
                        type="text"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          setSearchQuery(value);

                          if (!selectedWorksheet) {
                            handleSearch(value);
                          } else {
                            setSelectedWorksheet(null);
                            handleSearch(value);
                          }
                        }}
                        placeholder="Name of the work sheet"
                        disabled={!projectId}
                        className="placeholder-black"
                        style={{ color: "black" }}
                      />
                    </FormControl>
                    {projectId && openPopover && searchResults.worksheets.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <div className="max-h-[200px] overflow-y-auto">
                          {searchResults.worksheets.map((worksheet) => (
                            <div
                              key={worksheet._id}
                              className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                              onClick={() => handleWorksheetSelect(worksheet, field)}
                            >
                              {worksheet.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Info */}
            <div className="grid grid-cols-2 gap-4 text-[#64748B] font-normal text-sm leading-5">
              <p>Total logged time:</p>
              <p className={cn(selectedWorksheet ? "text-black font-medium" : "text-gray-500")}>
                {selectedWorksheet ? `${selectedWorksheet.totalLoggedTime.hours}h ${selectedWorksheet.totalLoggedTime.minutes}m` : "00h 00m"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[#64748B] font-normal text-sm leading-5">
              <p>Total activities:</p>
              <p className={cn(selectedWorksheet ? "text-black font-medium" : "text-gray-500")}>
                {selectedWorksheet ? selectedWorksheet.totalActivities : 0}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Assign to Project
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.reset();
                setSelectedWorksheet(null);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportedModal;
