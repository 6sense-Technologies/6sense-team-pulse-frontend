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

export function GrowthDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [goal, setGoal] = React.useState<string>("");

  function handleGoals(goals: string) {
    setGoal(goals);
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-sm bg-gray-100 mb-4 rounded-lg">
          <DrawerHeader>
            <DrawerTitle>Add Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            <DrawerClose asChild>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <form>
              <div className="mb-4">
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                  Goal
                </label>
                <Input
                  type="text"
                  id="goal"
                  name="goal"
                  placeholder="Enter your goal"
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