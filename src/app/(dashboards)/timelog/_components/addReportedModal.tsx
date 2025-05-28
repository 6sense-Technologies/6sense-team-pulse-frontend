"use client";

import React, { useEffect, useState } from "react";
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
  onClose: () => void;
}

const AddReportedModal = ({ date, selectedIds, onClose }: AddReportedModalProps) => {
  const session = useSession();
  const form = useForm();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    worksheets: [],
    loading: false,
  });
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState<WorkSheet | null>(null);

  const projectId = form.watch("project");

  const {
    formState: { isSubmitting },
  } = form;

  const { data: projectsList } = useQuery<Project[]>({
    queryKey: ["fetchProjects"],
    queryFn: () => GetProjectList(session),
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3 && projectId) {
        setSearchResults({ worksheets: [], loading: true });

        try {
          const worksheetData = await GetWorksheetList(
            {
              projectId,
              worksheetName: searchQuery,
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
      } else {
        setOpenPopover(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, projectId, date, session]);

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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0" variant="defaultEx">
          Assign to Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl leading-6">Work Sheet</DialogTitle>
          <DialogDescription className="text-[#64748B] font-normal text-sm leading-5">Group selected activities into a worksheet and assign it to a project in one go.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Project Select */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Project <span className="text-red-500">*</span></FormLabel>
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
                        type="text"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          if (!selectedWorksheet) {
                            setSearchQuery(e.target.value);
                            if (e.target.value.length >= 3) {
                              setOpenPopover(true);
                            } else {
                              setOpenPopover(false);
                            }
                          } else {
                            setSelectedWorksheet(null);
                            setSearchQuery(e.target.value);
                            if (e.target.value.length >= 3) {
                              setOpenPopover(true);
                            }
                          }
                        }}
                        onFocus={() => {
                          if (field.value && field.value.length >= 3) {
                            setOpenPopover(true);
                          }
                        }}
                        placeholder="Name of the work Sheet"
                        disabled={!projectId}
                      />
                    </FormControl>
                    {projectId && openPopover && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
                        {searchResults.loading ? (
                          <div className="p-2 space-y-2">
                            {[1, 2, 3].map((index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Skeleton className="h-8 w-full" />
                              </div>
                            ))}
                          </div>
                        ) : searchResults.worksheets.length > 0 ? (
                          <div className="max-h-[200px] overflow-y-auto">
                            {searchResults.worksheets.map((worksheet) => (
                              <div
                                key={worksheet._id}
                                className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                                onClick={() => {
                                  field.onChange(worksheet.name);
                                  setSelectedWorksheet(worksheet);
                                  setSearchQuery(worksheet.name);
                                  setOpenPopover(false);
                                }}
                              >
                                {worksheet.name}
                              </div>
                            ))}
                          </div>
                        ) : searchQuery.length >= 3 ? (
                          <div className="p-2">No worksheets found</div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {/* {!projectId && <div className="text-xs text-muted-foreground mt-1">Select a project first</div>} */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Info */}
            <div className="grid grid-cols-2 gap-4 text-[#64748B]">
              <p>Total logged time:</p>
              <p>{selectedWorksheet ? `${selectedWorksheet.totalLoggedTime.hours}h ${selectedWorksheet.totalLoggedTime.minutes}m` : "00h 00m"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[#64748B]">
              <p>Total activities:</p>
              <p>{selectedWorksheet ? selectedWorksheet.totalActivities : 0}</p>
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
