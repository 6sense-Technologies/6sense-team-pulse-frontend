"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import AvatarMenu from "@/components/AvatarMenu";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ButtonComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert, EllipsisVertical } from "lucide-react";
import Link from "next/link";

const FeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const session = useSession();

  return (
    <div className="w-full">
      <PageTitle title="Projects • Ops4 Team" />

      <div className="pl-4 pt-8 lg:pt-8 pr-[14px] w-full">
        <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1">
            <SidebarTrigger />
          </span>
          <AvatarMenu />
        </div>
        <div className="flex justify-between items-center">
          <GlobalBreadCrumb initialData="Feedback" initalLink="/feedback" />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading title="All Feedbacks" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-end w-full lg:ml-2">
            {/* <Searchbar
              placeholder="Search by project name"
              name="search"
              btntext="Search"
              className="mt-6 lg:mt-[18px] mb-[26px] gap-x-2 w-full md:max-w-[291px] relative"
              variant="light"
            /> */}
            {/* <ProjectDropdown placeholder="Filter by Tool" name="tool" active={false} className="mb-[26px]" /> */}
          </div>
          <div className="w-full md:w-auto">
            <Link href={`/feedback/send-feedback`}>
              <Button variant="defaultEx">
                <span className="text-nowrap flex items-center gap-x-[6px]">Send Feedback</span>
              </Button>
            </Link>
          </div>
        </div>

        <div>content</div>
      </div>
    </div>
  );
};

export default FeedbackPage;
