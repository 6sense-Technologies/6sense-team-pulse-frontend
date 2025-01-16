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

interface IFormData {
  goal: string;
}

const GrowthSchema = z.object({
  goal: z.string().min(1, "Goal is required!"),
});

export function GrowthDrawer({
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
    resolver: zodResolver(GrowthSchema),
  });

  const onSubmit = (data: IFormData): void => {
    console.log(data);
  };

  const handleCancel = () => {
    clearErrors();
    onClose();
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