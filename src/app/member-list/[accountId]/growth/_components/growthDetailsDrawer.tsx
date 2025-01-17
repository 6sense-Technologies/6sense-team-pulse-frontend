"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface IFormData {
  action: string;
}

const GrowthDetailSchema = z.object({
  action: z.string().min(1, "activity is required!"),
});

export function GrowthDetailsDrawer({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<IFormData>({
    resolver: zodResolver(GrowthDetailSchema),
  });

  const searchParams = useSearchParams();
  const goalId = searchParams.get("goalId");

  const AddGoalDetailsMutation = useMutation({
    mutationKey: ["addGoalMutation"],
    mutationFn: async (newGoalDetails: any) => {
      const res = await axios.post(`${TEMP_BACKEND_URI}/goals/action`, {
        ...newGoalDetails,
        goal: goalId,
      });
      return res.data;
    },
  });

  const onSubmit = (data: any): void => {
    AddGoalDetailsMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Activity added successfully!");
        refetch(); // Refetch the data to update the table
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to add activity!");
      },
    });
  };

  const handleCancel = () => {
    clearErrors();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-white transition-transform duration-300 ease-in-out transform">
        <div className="mx-auto w-full max-w-sm bg-gray-100 mb-4 rounded-lg">
          <DrawerHeader>
            <DrawerTitle>Add Activities</DrawerTitle>
            <DrawerDescription>Set your daily activities.</DrawerDescription>
            <DrawerClose asChild>
              <div />
            </DrawerClose>
          </DrawerHeader>
          <div className="pb-0 pl-4 pr-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label
                  htmlFor="activity"
                  className="block text-sm font-medium text-gray-700 pb-1"
                >
                  Activity <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register("action")}
                    className={cn(
                      "w-full border px-4 py-2 rounded-md",
                      errors.action ? "border-red-400" : ""
                    )}
                  />
                  {errors.action && (
                    <p className="text-red-400 text-sm absolute">
                      {errors.action.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" variant="primaryFormBtn" className="w-full">
                Submit
              </Button>
            </form>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                variant="secondaryFormBtn"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}