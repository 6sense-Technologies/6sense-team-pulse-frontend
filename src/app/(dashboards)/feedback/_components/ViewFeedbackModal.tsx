"use client";

import { Button } from "@/components/ButtonComponent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { GetSingleFeedback } from "../../../../../helpers/feedback/feedbackApi";
import Image from "next/image";

// Define interface for the feedback data
interface UserInfo {
  avatarUrls: string;
  designation: string;
  displayName: string;
  emailAddress: string;
  _id: string;
}

interface FeedbackData {
  assignedBy: string;
  assignedTo: UserInfo;
  comment: string;
  createdAt: string;
  linkedIssues: string[];
  organization: string;
  status: boolean;
  tone: string;
  type: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

const ViewFeedbackModal = ({ feedbackId }: { feedbackId: string }) => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Data fetching
  const {
    data: singleFeedback,
    isFetching: singleFeedbackLoading,
    refetch: singleFeedbackRefetch,
  } = useQuery<FeedbackData>({
    queryKey: ["fetchFeedback", feedbackId],
    queryFn: () => GetSingleFeedback(session, feedbackId),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      {singleFeedback && (
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md bg-white lg:max-w-xl">
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <Separator className="my-4 bg-gray-300" />
            {/* <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription> */}
          </DialogHeader>
          <div className="">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <div>
                  <Image
                    src={singleFeedback?.assignedTo?.avatarUrls || "/placeholder-avatar.png"}
                    alt={singleFeedback?.assignedTo?.displayName || "User"}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-sm">{singleFeedback?.assignedTo?.displayName}</h1>
                  <p className="font-normal text-xs text-[#334155]">{singleFeedback?.assignedTo?.emailAddress}</p>
                  <p className="font-normal text-xs text-[#334155]">{singleFeedback?.assignedTo?.designation}</p>
                </div>
              </div>
              <div className="font-normal text-sm text-[#334155]">
                <p className="flex items-center gap-2">
                  Posted on:
                  <span className="text-black">
                    {singleFeedback?.createdAt
                      ? (() => {
                          const date = new Date(singleFeedback.createdAt);
                          const hours = date.getHours().toString().padStart(2, "0");
                          const minutes = date.getMinutes().toString().padStart(2, "0");
                          const day = date.getDate();
                          const year = date.getFullYear();
                          const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
                          return (
                            <div className="flex items-center w-full">
                              {hours}:{minutes} <Separator orientation="vertical" className="mx-1 text-black" />
                              <span className=" border-l-2 border-gray-300 pl-2">
                                {month} {day}, {year}
                              </span>
                            </div>
                          );
                        })()
                      : ""}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full mt-4 gap-4">
                <p className="border rounded-full py-1.5 px-3">{singleFeedback?.type}</p>
                <p
                  className={`py-1.5 px-3 rounded-full ${
                    singleFeedback?.tone === "Positive"
                      ? "bg-green-100 text-green-800"
                      : singleFeedback?.tone === "Negative"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {singleFeedback?.tone}
                </p>
              </div>
              <div className="w-full text-right">
                {singleFeedback?.type === "Bug" || singleFeedback?.type === "Task" || singleFeedback?.type === "User Story" ? (
                  <p className="text-sm font-normal text-gray-500">
                    Linked Items:
                    <span className="text-black pl-1">{singleFeedback?.linkedIssues.length}</span>
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <p className="wrap-anywhere mt-4">{singleFeedback?.comment || "No comment provided."}</p>
            </div>
          </div>
          {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ViewFeedbackModal;
