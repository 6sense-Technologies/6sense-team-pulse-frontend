"use client";

import AvatarMenu from "@/components/AvatarMenu";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import EmptyTimelogView from "../../timelog/_components/emptyTimelogView";
import WorksheetTab from "./_components/worksheetTab";
import { Button } from "@/components/ButtonComponent";
import { EllipsisVertical } from "lucide-react";

const ProjectIdPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "analytics" | "worksheet">(
    tabParam === "team" ? "team" : tabParam === "worksheet" ? "worksheet" : tabParam === "analytics" ? "analytics" : "overview",
  );

  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : null;
  //   console.log("🚀 ~ ProjectIdPage ~ projectId:", projectId);

  return (
    <div className="w-full">
      <PageTitle title="Projects • Ops4 Team" />

      <div className="pl-4 pt-8 lg:pt-8 pr-[14px] w-full">
        <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1 ">
            <SidebarTrigger />
          </span>
          <AvatarMenu />
        </div>
        <div className="flex justify-between items-center">
          <GlobalBreadCrumb initialData="Projects" initalLink="/projects" secondayData="Project Details" />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading
          // title={reportedWorksheetList?.projectName || ""}
          title="HireX"
        />

        {/* tabs */}
        <div className="mb-3 flex flex-col items-start justify-between overflow-x-hidden md:mb-0 lg:flex-row lg:items-center">
          <div className="item-start flex w-full flex-col md:flex-row md:items-end md:gap-x-4 md:gap-y-0 lg:ml-2">
            <div className="flex justify-center gap-4 my-4 md:mb-6 md:mt-4">
              {/* Tabs: Unreported / Reported */}
              <Tabs
                value={activeTab} // Make it controlled by state
                className="text-[#64748B] w-full rounded-none"
                onValueChange={(value) => {
                  // Reset selections when switching tabs
                  //   setSelectedIds([]);
                  // Update the active tab
                  setActiveTab(value as "overview" | "team" | "analytics" | "worksheet");

                  // Update URL when tab changes
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("tab", value);
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
              >
                <TabsList className="bg-transparent flex">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:text-black data-[state=active]:border-b-2 rounded-none data-[state=active]:shadow-none border-black w-full"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="data-[state=active]:text-black data-[state=active]:border-b-2 rounded-none data-[state=active]:shadow-none border-black w-full"
                  >
                    Team
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:text-black data-[state=active]:border-b-2 rounded-none data-[state=active]:shadow-none border-black w-full"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="worksheet"
                    className="data-[state=active]:text-black data-[state=active]:border-b-2 rounded-none data-[state=active]:shadow-none border-black w-full"
                  >
                    Work Sheet
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Date Picker & Create Log Button */}
          <div className="md:flex md:items-center md:gap-x-4 md:justify-center">
            <Button disabled className="mt-4 md:mt-0" variant="defaultEx">
              Export Report
            </Button>
            <EllipsisVertical />
          </div>
        </div>

        <div className="mt-6 lg:ml-2 lg:mt-0">
          {/* {activeTab === "worksheet" ? (
              timelogListLoading ? (
                <EmptyTableSkeleton />
              ) : timelogList?.data?.length === 0 ? (
                <EmptyTimelogView />
              ) : (
                //   <TimelogTable
                //     totalCountAndLimit={totalCountAndLimit}
                //     projects={timelogList?.data ?? []}
                //     loading={timelogListLoading}
                //     refetch={timelogListRefetch}
                //     currentPage={pages}
                //     selectedIds={selectedIds}
                //     setSelectedIds={setSelectedIds}
                //   />
               
              )
            ) : (
              <div>Worksheet Placeholder</div> // Replace with actual Worksheet component
            )} */}

          {activeTab === "team" ? (
            <div className="flex justify-center items-center h-64">team</div>
          ) : activeTab === "analytics" ? (
            <div className="flex justify-center items-center h-64">analytics</div>
          ) : activeTab === "worksheet" ? (
            <WorksheetTab projectId={projectId as string} />
          ) : (
            <div className="flex justify-center items-center h-64">overview</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectIdPage;
