import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FolderOpen, FolderPlus, Scroll, UserX } from "lucide-react";
import { Button } from "@/components/ButtonComponent";
import activity from "../../../../../public/logo/activity.png";

const EmptyFeedbackListView = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-[60px] lg:pt-[200px]">
      <div className="flex flex-col items-center justify-center text-center pt-1">
        <span>
          {/* <Image src={activity} alt="activity-Icon" /> */}
          <FolderOpen />
        </span>
        <p className="text-deepBlackColor mt-1 text-[16px] font-medium">No Feedbacks Found</p>
        <p className="text-sm text-inputFooterColor pt-1">Get started by sending feedback to others.</p>
      </div>
      {/* <div className="w-auto pt-6">
        <Link href={`/projects/create`}>
          <Button variant="defaultEx">
            <span className="text-nowrap flex items-center gap-x-[6px]">
              <FolderPlus size={16} className="mr-1" />
              Create Project
            </span>
          </Button>
        </Link>
      </div> */}
    </div>
  );
};

export default EmptyFeedbackListView;
