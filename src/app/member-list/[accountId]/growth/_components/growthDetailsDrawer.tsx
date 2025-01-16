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

interface IFormData {
  activity: string;
}

const GrowthDetailSchema = z.object({
  activity: z.string().min(1, "activity is required!"),
});


export function GrowthDetailsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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

  const onSubmit = (data: IFormData): void => {
    console.log(data);
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
                    {...register("activity")}
                    className={cn(
                      "w-full border px-4 py-2 rounded-md",
                      errors.activity ? "border-red-400" : ""
                    )}
                  />
                  {errors.activity && (
                    <p className="text-red-400 text-sm absolute">
                      {errors.activity.message}
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
