"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ButtonComponent";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { CreateLogData } from "../../../../../helpers/timelogs/timelogApi";
import { PencilLine } from "lucide-react";
import { TSelectedTimeLog } from "./timelogTable";

interface ActivityOption {
  value: string;
  label: string;
}

const formSchema = z
  .object({
    logTitle: z.string().min(1, "Log title is required."),
    activity: z.object(
      {
        value: z.string().min(1, "Please select an activity from the list."),
        label: z.string().min(1, "Please select an activity from the list."),
      },
      {
        required_error: "Please select activity.",
      },
    ),
    startTime: z.date({
      required_error: "Enter start time.",
      invalid_type_error: "Enter start time.",
    }),
    endTime: z.date({
      required_error: "Enter end time.",
      invalid_type_error: "Enter end time.",
    }),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.startTime < data.endTime;
    },
    {
      message: "Start time must be before end time.",
      path: ["startTime"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface EditLogModalProps {
  selectedTimeLog?: TSelectedTimeLog;
  editTimelogModalOpen: boolean;
  setEditTimelogModalOpen: (open: boolean) => void;
}

const EditLogModal = ({ selectedTimeLog, editTimelogModalOpen, setEditTimelogModalOpen }: EditLogModalProps) => {
  console.log("🚀 ~ EditLogModal ~ selectedTimeLog:", selectedTimeLog);
  const queryClient = useQueryClient();
  const session = useSession();

  const getTodayMidnight = (): Date => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const [startSelectedDateTime, setStartSelectedDateTime] = useState<Date>(getTodayMidnight());
  const [endSelectedDateTime, setEndSelectedDateTime] = useState<Date>(getTodayMidnight());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logTitle: selectedTimeLog?.name || "",
      activity: { value: selectedTimeLog?.manualType || "", label: selectedTimeLog?.manualType || "" },
      startTime: selectedTimeLog?.startTime ? new Date(selectedTimeLog.startTime) : undefined,
      endTime: selectedTimeLog?.endTime ? new Date(selectedTimeLog.endTime) : undefined,
    },
  });

  const {
    formState: { isSubmitting, errors },
    getValues,
  } = form;
  console.log("🚀 ~ EditLogModal ~ getValues:", getValues());

  const createLogMutation = useMutation({
    mutationFn: (data: { name: string; manualType: string; startTime: string; endTime: string }) => CreateLogData(data, session),
    onSuccess: () => {
      toast({
        title: "Log Created",
        description: "Your custom activity has been successfully added.",
      });
      //   setOpen(false);
      form.reset();
      setStartSelectedDateTime(getTodayMidnight());
      setEndSelectedDateTime(getTodayMidnight());
      queryClient.invalidateQueries({ queryKey: ["fetchTimelogs"] });
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Failed to Create Log",
        description: error.response?.data?.message || "There was an issue adding your activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    const formatedData = {
      name: data.logTitle,
      manualType: data.activity.value,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    };

    createLogMutation.mutate(formatedData);
  };

  const activityList: ActivityOption[] = [
    {
      value: "Brainstorming",
      label: "Brainstorming",
    },
    {
      value: "Code Review",
      label: "Code Review",
    },
    {
      value: "Collaboration",
      label: "Collaboration",
    },
    {
      value: "Designing",
      label: "Designing",
    },
    {
      value: "Documentation",
      label: "Documentation",
    },
    {
      value: "Emailing",
      label: "Emailing",
    },
    {
      value: "Meeting",
      label: "Meeting",
    },
    {
      value: "Planning",
      label: "Planning",
    },
    {
      value: "Presentation",
      label: "Presentation",
    },
    {
      value: "Researching",
      label: "Researching",
    },
    {
      value: "Testing",
      label: "Testing",
    },
    {
      value: "Writing",
      label: "Writing",
    },
  ];

  useEffect(() => {
    if (selectedTimeLog) {
      setStartSelectedDateTime(selectedTimeLog.startTime ? new Date(selectedTimeLog.startTime) : getTodayMidnight());
      setEndSelectedDateTime(selectedTimeLog.endTime ? new Date(selectedTimeLog.endTime) : getTodayMidnight());
      form.reset({
        logTitle: selectedTimeLog.name || "",
        activity: { value: selectedTimeLog.manualType || "", label: selectedTimeLog.manualType || "" },
        startTime: selectedTimeLog.startTime ? new Date(selectedTimeLog.startTime) : undefined,
        endTime: selectedTimeLog.endTime ? new Date(selectedTimeLog.endTime) : undefined,
      });
    }
  }, [selectedTimeLog]);

  return (
    <Dialog open={editTimelogModalOpen} onOpenChange={setEditTimelogModalOpen}>
      <DialogTrigger asChild>
        {/* <Button className="mt-4 md:mt-0" variant="defaultEx">
          Create Log
        </Button> */}
        <PencilLine className="w-4 h-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl leading-6">Edit Log</DialogTitle>
          <DialogDescription className="text-[#64748B] font-normal text-sm leading-5">
            Update activity details in your custom log entry.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="logTitle"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className={fieldState.error ? "text-black" : ""}>
                    Log Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name of the log" className={`placeholder-black`} style={{ color: "black" }} {...field} />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activity"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className={fieldState.error ? "text-black" : ""}>
                    Activity <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select<ActivityOption>
                    styles={{
                      indicatorSeparator: (base) => ({ ...base, display: "none" }),
                      // control: (base, state) => ({
                      //   ...base,
                      //   borderColor: fieldState.error ? "#ef4444" : base.borderColor,
                      //   "&:hover": {
                      //     borderColor: fieldState.error ? "#ef4444" : base.borderColor,
                      //   },
                      // }),
                    }}
                    defaultValue={undefined}
                    value={field?.value}
                    onChange={(val) => field.onChange(val)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="Select"
                    options={activityList}
                  />
                  <div className="h-5">
                    <p className="text-[0.8rem] font-medium text-destructive">{fieldState.error ? "Select an activity" : null}</p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className={fieldState.error ? "text-black" : ""}>
                      Start <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={startSelectedDateTime}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setStartSelectedDateTime(date);
                            field.onChange(date);
                          }
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={60}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        customInput={
                          <Input
                            className={`placeholder-gray-500`}
                            ref={field.ref}
                            value={field.value ? field.value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            readOnly
                          />
                        }
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <FormItem {...field}>
                    <FormLabel className={fieldState.error ? "text-black" : ""}>
                      End <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={endSelectedDateTime}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setEndSelectedDateTime(date);
                            field.onChange(date);
                          }
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={60}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        customInput={
                          <Input
                            className={`placeholder-gray-500`}
                            ref={field.ref}
                            value={field.value ? field.value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            readOnly
                          />
                        }
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#64748B] text-sm leading-5">
              <p className="font-normal">Total logged time:</p>
              <p className="font-semibold">
                {(() => {
                  const startTime = form.watch("startTime");
                  const endTime = form.watch("endTime");

                  if (startTime && endTime && startTime < endTime) {
                    const diffMs = endTime.getTime() - startTime.getTime();
                    const hours = Math.floor(diffMs / 3600000);
                    const minutes = Math.floor((diffMs % 3600000) / 60000);
                    return `${hours}h ${minutes}m`;
                  }
                  return "00h 00m";
                })()}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.reset();
                // setOpen(false);
                setEditTimelogModalOpen(false);
                setStartSelectedDateTime(getTodayMidnight());
                setEndSelectedDateTime(getTodayMidnight());
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

export default EditLogModal;
