"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ButtonComponent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  workSheetName: z.string().min(1, "Log Title is required"),
  project: z.string().min(1, "Activity is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateLogModal = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workSheetName: "",
      project: "",
      startTime: "",
      endTime: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log("Form inputs:", {
      title: data.workSheetName,
      activity: data.project,
      start: data.startTime,
      end: data.endTime,
    });
    // Here you would typically handle form submission
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
              name="workSheetName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className={fieldState.error ? "text-black" : ""}>
                    Log Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name of the log" className="placeholder-black" style={{ color: "black" }} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Select */}
            <FormField
              control={form.control}
              name="project"
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
                  <FormMessage />
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
                      <Input type="text" placeholder="00:00" className="placeholder-black" style={{ color: "black" }} {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type="text" placeholder="00:00" className="placeholder-black" style={{ color: "black" }} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Time Summary */}
            <div className="grid grid-cols-2 gap-4 text-[#64748B] font-normal text-sm leading-5">
              <p>Total logged time:</p>
              <p>00h 00m</p>
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
