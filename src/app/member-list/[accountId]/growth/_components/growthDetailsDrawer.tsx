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

export function GrowthDetailsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [goal, setGoal] = React.useState<string>("");

  function handleGoals(goals: string) {
    setGoal(goals);
  }

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
          <div className="p-4 pb-0">
            <form>
              <div className="mb-4">
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                  Activity
                </label>
                <Input
                  type="text"
                  id="activity"
                  name="activity"
                  placeholder="Enter your activity"
                  value={goal}
                  onChange={(e) => handleGoals(e.target.value)}
                  className="mt-1 block w-full placeholder:text-subHeading"
                />
              </div>
              <Button type="submit" variant="primaryFormBtn" className="w-full">Submit</Button>
            </form>
          </div>
          <DrawerFooter className="flex space-x-2">
            <DrawerClose asChild>
              <Button variant="secondaryFormBtn" className="w-full" onClick={onClose}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}