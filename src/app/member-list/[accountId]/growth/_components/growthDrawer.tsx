"use client";

import * as React from "react";
import { X } from "lucide-react";

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
import toast from "react-hot-toast";

interface IFormData {
  goal: string;
  user?: string;
}

const GrowthSchema = z.object({
  goal: z.string().min(1, "Goal is required!"),
});

export function GrowthDrawer({
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
    reset,
    clearErrors,
  } = useForm<IFormData>({
    resolver: zodResolver(GrowthSchema),
  });

  const AddGoalMutation = useMutation({
    mutationKey: ["addGoalMutation"],
    mutationFn: async (newGoal: IFormData) => {
      const res = await axios.post(`${TEMP_BACKEND_URI}/goals`,
        {
          ...newGoal,
        }
      )
      return res.data;
    }
   
  });


  // const onSubmit = (data: IFormData): void => {
  //   setIsLoading(true);
  //   addMemberMutation.mutate(data, {
  //     onSuccess: () => {
  //       toast.success("Member added successfully!");
  //       // onClose();
  //       router.push("/member-list?page=1");
  //       refetch();
  //     },
  //     onError: (error: any) => {
  //       toast.error("Unable to add the member");
  //       console.error(error);
  //     },
  //     onSettled: () => {
  //       setIsLoading(false); // Stop loader
  //     },
  //   });
  // };

  const handleCancel = () => {
    clearErrors();
    reset();
    onClose();
  };


  const onSubmit = (data: IFormData): void => {
    const Formdata = {
      goal: data.goal,
      user: localStorage.getItem("memberId") || undefined,
    }
    AddGoalMutation.mutate(Formdata,
      {
        onSuccess: () => 
        {
          toast.success("Goal added successfully!");
          handleCancel();
          refetch();
        }
      }
    );
  };


  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-sm bg-gray-100 mb-2 rounded-lg">
          <DrawerHeader>
            <DrawerTitle>Add Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            <DrawerClose asChild></DrawerClose>
          </DrawerHeader>
          <div className="pb-0 pl-4 pr-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label
                  htmlFor="goal"
                  className="block text-sm font-medium text-gray-700 pb-1"
                >
                  Goal <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                <Input
                  {...register("goal")}
                  className={cn(
                    "w-full border px-4 py-2 rounded-md",
                    errors.goal ? "border-red-400" : ""
                  )}
                />
                {errors.goal && (
                  <p className="text-red-400 text-sm absolute">
                    {errors.goal.message}
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