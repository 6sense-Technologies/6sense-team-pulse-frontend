"use client";

import React, { useState, useRef, forwardRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ButtonComponent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { CreateLogData } from "../../../../../helpers/timelogs/timelogApi";

const formSchema = z
  .object({
    logTitle: z.string().min(1, "Log title is required."),
    activity: z.string().min(1, "Please select activity."),
    startTime: z.string().min(1, "Enter start time."),
    endTime: z.string().min(1, "Enter end time."),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return start < end;
    },
    {
      message: "Start time must be before end time.",
      path: ["startTime"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface CreateLogModalProps {
  date: Date;
}

const CreateLogModal = ({ date }: CreateLogModalProps) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const [open, setOpen] = useState(false);
  // Set default time to 00:00 (midnight) today
  const getTodayMidnight = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const [startSelectedDateTime, setStartSelectedDateTime] = useState<Date | null>(getTodayMidnight());
  const [endSelectedDateTime, setEndSelectedDateTime] = useState<Date | null>(getTodayMidnight());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logTitle: "",
      activity: "",
      startTime: "",
      endTime: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // {
  //   "name": "Hello",
  //   "manualType": "Brainstorming",
  //   "startTime": "2025-05-23T23:55:56Z",
  //   "endTime": "2025-05-23T23:59:59Z"
  // }

  const createLogMutation = useMutation({
    mutationFn: (data: any) => CreateLogData(data, session),
    onSuccess: () => {
      toast({
        title: "Log Updated",
        description: "Your custom activity has been successfully edited.",
      });
      setOpen(false);
      form.reset();
      setStartSelectedDateTime(getTodayMidnight());
      setEndSelectedDateTime(getTodayMidnight());
      // setSelectedWorksheet(null);
      queryClient.invalidateQueries({ queryKey: ["fetchTimelogs"] });
      // onClose();
      // onSuccess?.();
      // setSelectedIds([]); // This is fine here
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Failed to Update Log",
        description: error.response?.data?.message || "There was an issue saving your changes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // console.log("Form inputs:", {
    //   title: data.logTitle,
    //   activity: data.activity,
    //   start: data.startTime,
    //   end: data.endTime,
    // });
    const pad = (n: number) => n.toString().padStart(2, "0");
    const getDateTime = (date: Date, time: string) => {
      const [h, m] = time.split(":").map(Number);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h)}:${pad(m)}:00Z`;
    };

    const formatedData = {
      name: data.logTitle,
      manualType: data.activity,
      startTime: getDateTime(date, data.startTime),
      endTime: getDateTime(date, data.endTime),
    };

    createLogMutation.mutate(formatedData);
    console.log("🚀 ~ onSubmit ~ formatedData:", formatedData);
    setOpen(false);
  };

  const activityList = [
    "Brainstorming",
    "Code Review",
    "Collaboration",
    "Designing",
    "Documentation",
    "Emailing",
    "Meeting",
    "Planning",
    "Presentation",
    "Researching",
    "Testing",
    "Writing",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0" variant="defaultEx">
          Create Log
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl leading-6">Create Log</DialogTitle>
          <DialogDescription className="text-[#64748B] font-normal text-sm leading-5">
            Manually enter activities to create a custom log entry.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Log Title */}
            <FormField
              control={form.control}
              name="logTitle"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className={fieldState.error ? "text-black" : ""}>
                    Log Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name of the log" className="placeholder-black" style={{ color: "black" }} {...field} />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Activity Select */}
            <FormField
              control={form.control}
              name="activity"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className={fieldState.error ? "text-black" : ""}>
                    Activity <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 !border-none !outline-none">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {activityList.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Time Inputs */}
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
                        onChange={(date) => {
                          setStartSelectedDateTime(date);
                          if (date) {
                            const hours = date.getHours().toString().padStart(2, "0");
                            const minutes = date.getMinutes().toString().padStart(2, "0");
                            field.onChange(`${hours}:${minutes}`);
                          } else {
                            field.onChange("");
                          }
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        customInput={
                          <Input className="placeholder-gray-500" ref={field.ref} value={field.value} onChange={field.onChange} readOnly />
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
                  <FormItem>
                    <FormLabel className={fieldState.error ? "text-black" : ""}>
                      End <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={endSelectedDateTime}
                        onChange={(date) => {
                          setEndSelectedDateTime(date);
                          if (date) {
                            const hours = date.getHours().toString().padStart(2, "0");
                            const minutes = date.getMinutes().toString().padStart(2, "0");
                            field.onChange(`${hours}:${minutes}`);
                          } else {
                            field.onChange("");
                          }
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={60}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        customInput={
                          <Input className="placeholder-gray-500" ref={field.ref} value={field.value} onChange={field.onChange} readOnly />
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

            {/* Time Summary */}
            <div className="grid grid-cols-2 gap-4 text-[#64748B] text-sm leading-5">
              <p className="font-normal">Total logged time:</p>
              <p
                className={(() => {
                  const start = form.getValues("startTime");
                  const end = form.getValues("endTime");

                  // Check if we have valid times that calculate to a positive duration
                  if (!start || !end) return "font-normal";

                  const [startH, startM] = start.split(":").map(Number);
                  const [endH, endM] = end.split(":").map(Number);
                  const startMinutes = startH * 60 + startM;
                  const endMinutes = endH * 60 + endM;

                  // Apply bold font only when we have valid times with positive duration
                  return startMinutes < endMinutes ? "font-semibold text-black" : "font-normal";
                })()}
              >
                {(() => {
                  const start = form.getValues("startTime");
                  const end = form.getValues("endTime");
                  if (!start || !end) return "00h 00m";
                  const [startH, startM] = start.split(":").map(Number);
                  const [endH, endM] = end.split(":").map(Number);
                  const startMinutes = startH * 60 + startM;
                  const endMinutes = endH * 60 + endM;
                  if (isNaN(startMinutes) || isNaN(endMinutes) || startMinutes >= endMinutes) return "00h 00m";
                  const diff = endMinutes - startMinutes;
                  const hours = Math.floor(diff / 60);
                  const minutes = diff % 60;

                  // Format hours - remove leading zero for all values except 0
                  const hoursFormatted = hours === 0 ? "00" : hours.toString();

                  return `${hoursFormatted}h ${minutes.toString().padStart(2, "0")}m`;
                })()}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Log"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.reset();
                setOpen(false);
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

export default CreateLogModal;
