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

import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { GetLinkedItems } from "../../../../../../../helpers/feedback/feedbackApi";
import Link from "next/link";

const typeList = [
  { _id: "Bug", name: "Bug" },
  { _id: "Personal", name: "Personal" },
  { _id: "Suggestions", name: "Suggestions" },
  { _id: "Task", name: "Task" },
  { _id: "User Story", name: "User Story" },
];

const toneList = [
  { _id: "Positive", name: "Positive" },
  { _id: "Neutral", name: "Neutral" },
  { _id: "Negative", name: "Negative" },
];

const FeedbackForm = ({ memberId }: { memberId: string }) => {
  const session = useSession();

  const { data: linkedItemsData, isFetching: linkedItemsDataLoading } = useQuery<any>({
    queryKey: ["linkedItemsData", memberId],
    queryFn: () => GetLinkedItems(memberId as string, session),
  });
  //   console.log("🚀 ~ FeedbackForm ~ linkedItemsData:", linkedItemsData?.[0].issueCode);
  //   console.log("🚀 ~ FeedbackForm ~ linkedItemsData:", linkedItemsData?.[0]._id);

  //   form submission
  console.log("🚀 ~ FeedbackForm ~ memberId:", memberId);
  const formSchema = z.object({
    type: z.string().min(1, "Please select an option."),
    tone: z.string().min(1, "Please select an option."),
    comment: z.string().min(1, "Comment is required."),
    linkedItems: z.array(z.string()).optional(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      tone: "",
      comment: "",
      linkedItems: [],
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Update your onSubmit function typing
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("🚀 ~ constonSubmit:SubmitHandler<FormValues>= ~ data:", data);
    //   const payload = {
    //     projectId: data.project,
    //     worksheetName: data.workSheetName,
    //     date: date,
    //     activityIds: selectedIds,
    //   };

    //   reportedMutation.mutate(payload);
  };

  // Create the linked items options from API data
  // Define interface for linked items from API
  interface LinkedItem {
    _id: string;
    issueCode: string;
  }

  // Define interface for select options
  interface SelectOption {
    value: string;
    label: string;
  }

  const linkedItemOptions: SelectOption[] =
    linkedItemsData?.map((item: LinkedItem) => ({
      value: item._id,
      label: item.issueCode,
    })) || [];

  // Add this watch to get the current type value
  const selectedType = form.watch("type");

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Type Select */}
          <FormField
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className={fieldState.error ? "text-black" : ""}>
                  Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // form.setValue("type", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select" className="text-gray-500" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {typeList?.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
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

          {/* Linked Items - only show for Bug, User Story, Task */}
          {(selectedType === "Bug" || selectedType === "User Story" || selectedType === "Task") && (
            <FormField
              control={form.control}
              name="linkedItems"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className={fieldState.error ? "text-black" : ""}>
                    Linked Items <span className="text-gray-500">(Optional)</span>
                  </FormLabel>
                  <MultiSelect
                    options={linkedItemOptions}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    placeholder="Enter the links of the linked items"
                    variant="inverted"
                    animation={2}
                  />
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Tone Select */}
          <FormField
            control={form.control}
            name="tone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className={fieldState.error ? "text-black" : ""}>
                  Tone <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // form.setValue("tone", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="[&_[data-placeholder]]:text-gray-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {toneList?.map((tone) => (
                      <SelectItem key={tone._id} value={tone._id}>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn("w-2 h-2 rounded-full", {
                              "bg-[#15803D]": tone._id === "Positive", // Positive
                              "bg-[#6B7280]": tone._id === "Neutral", // Negative
                              "bg-[#B91C1C]": tone._id === "Negative", // Neutral
                            })}
                          />
                          {tone.name}
                        </div>
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

          {/* Comment */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className={fieldState.error ? "text-black" : ""}>
                  Comment <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Write something ..." className="h-24" />
                </FormControl>
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Worksheet Input */}
          {/* <FormField
            control={form.control}
            name="workSheetName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className={fieldState.error ? "text-black" : ""}>
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

                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          /> */}

          <div className="flex gap-2 mt-8 mb-28">
            <Link href="/feedback/send-feedback">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                // onClick={() => {
                //   form.reset();
                // }}
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full"
              //   disabled={isSubmitting}
            >
              Send
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
