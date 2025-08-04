"use client";

import { Button } from "@/components/ButtonComponent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { GetSingleFeedback } from "../../../../../helpers/feedback/feedbackApi";
import Image from "next/image";
import { ArrowLeft, CalendarCheck, CalendarClock, ExternalLink } from "lucide-react";
import { CustomTable } from "@/components/ui/customTable/CustomTable";
import Link from "next/link";

// Define interface for the feedback data
interface UserInfo {
  avatarUrls: string;
  designation: string;
  displayName: string;
  emailAddress: string;
  _id: string;
}

// Updated interface to include linkedIssues with proper structure
interface LinkedIssue {
  issueCode: string;
  issueSummary: string;
  issueIdUrl?: string;
  planned?: boolean;
}

interface FeedbackData {
  assignedBy: string;
  assignedTo: UserInfo;
  comment: string;
  createdAt: string;
  linkedIssues: LinkedIssue[];
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
  const [showLinkedIssues, setShowLinkedIssues] = useState(false);

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

  const linkedIssueColumns = [
    {
      header: "Link ID",
      accessorKey: "issueCode",
      cell: ({ row }: { row: any }) => <div className="w-28">{row.original.issueCode}</div>,
    },
    {
      header: "Linked Items",
      accessorKey: "issueSummary",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <span>
            {row.original.planned ? (
              <CalendarCheck className="mr-1 h-4 w-4 text-blue-500" />
            ) : (
              <CalendarClock className="mr-1 h-4 w-4 text-gray-500" />
            )}
          </span>
          <span>{row.original?.issueSummary}</span>
        </div>
      ),
    },
    {
      header: "",
      accessorKey: "issueIdUrl",
      cell: ({ row }: { row: any }) =>
        row.original?.issueIdUrl ? (
          <Link
            href={row.original?.issueIdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null,
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setShowLinkedIssues(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>

      {singleFeedback && (
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md bg-white lg:max-w-xl">
          <DialogHeader>
            {showLinkedIssues && singleFeedback.linkedIssues.length > 0 ? (
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <span>
                    <ArrowLeft className="cursor-pointer h-4 w-4" onClick={() => setShowLinkedIssues(false)} />
                  </span>
                  Linked Items
                </div>
              </DialogTitle>
            ) : (
              <DialogTitle>Feedback</DialogTitle>
            )}

            <Separator className="my-4 bg-gray-300" />
          </DialogHeader>

          {showLinkedIssues && singleFeedback.linkedIssues.length > 0 ? (
            <div className="">
              <CustomTable columns={linkedIssueColumns} data={singleFeedback?.linkedIssues} />
            </div>
          ) : (
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
                    <p className="text-sm font-normal">
                      <span onClick={() => setShowLinkedIssues(!showLinkedIssues)} className="border-b border-black cursor-pointer">
                        Linked Items:
                      </span>
                      <span className="pl-1">{singleFeedback?.linkedIssues?.length || 0}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 p-4">
                <p className="whitespace-pre-wrap break-words overflow-y-auto max-h-60">{singleFeedback?.comment || "No comment provided."}</p>
              </div>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ViewFeedbackModal;
