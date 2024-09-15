"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import { cn } from "@/app/utils/tailwindMerge";
import { X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMemberDrawer = ({ isOpen, onClose }: IProps): JSX.Element => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent): void => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listeners on unmount
    return (): void => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


  const [jiraOrTrello, setJiraOrTrello] = useState("");

  console.log(jiraOrTrello);

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/10 z-50 transform transition-transform duration-300 ease-in-out translate-x-full",
        {
          "translate-x-0": isOpen,
        }
      )}
    >
      <div
        ref={drawerRef}
        className="bg-white fixed right-0 top-0 bottom-0 max-w-lg w-full md:max-w-lg rounded-lg overflow-hidden shadow-xl overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-slate-50 p-5 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add Member</h1>
              <p className="text-slate-400">
                Get started by filling in the information to add a new team member
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-white px-10 py-4 overflow-auto">
            <h2 className="text-xl font-bold">Member Information</h2>
            <form className="mt-4">
              {/* Form content will go here */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center">
                    <label className="w-[200px] text-nowrap">
                      Jira/Trello <span className="text-red-500">*</span>
                    </label>
                    <select onChange={(e) => { setJiraOrTrello(e.target.value) }} className="w-full border outline-none px-4 py-2 rounded-md">
                      <option value="">Select</option>
                      <option value="jira">Jira</option>
                      <option value="trello">Trello</option>
                    </select>
                  </div>
                </div>
                {
                  jiraOrTrello === "jira" && (
                    <div>
                      <div className="flex items-center">
                        <label className="w-[200px] text-nowrap">
                          Jira ID <span className="text-red-500">*</span>
                        </label>
                        <input placeholder="Enter Jira ID" className="w-full border outline-none px-4 py-2 rounded-md" />
                      </div>
                    </div>
                  )
                }
                {
                  jiraOrTrello === "trello" && (
                    <div>
                      <div className="flex items-center">
                        <label className="w-[200px] text-nowrap">
                          Trello ID <span className="text-red-500">*</span>
                        </label>
                        <input placeholder="Enter Trello ID" className="w-full border outline-none px-4 py-2 rounded-md" />
                      </div>
                    </div>
                  )
                }
              </div>
            </form>
          </div>

          {/* Button Section */}
          <div className="py-5 pr-10 pl-10 bg-slate-50 flex gap-5 justify-end">
            <Button variant={"secondary"} type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              prefixIcon="PlusCircle"
              type="button"
              className="w-full md:w-[153px]"
              prefixIconClassName="plusIcon"
            >
              Create
            </Button>
          </div>
        </div>
      </div >
    </div >
  );
};

export default AddMemberDrawer;
