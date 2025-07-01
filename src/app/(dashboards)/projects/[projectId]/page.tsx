"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { GetSingleProjectDetails } from "../../../../../helpers/projects/projectApi";
import AvatarMenu from "@/components/AvatarMenu";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ButtonComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorksheetTab from "./_components/worksheetTab";
import { CircleAlert, EllipsisVertical } from "lucide-react";
import { ConnectLinear } from "../../../../../helpers/linear/linearApi";

const ProjectIdPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const session = useSession();
  const tabParam = searchParams.get("tab");
  const projectId = typeof params.projectId === "string" ? params.projectId : null;
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "analytics" | "worksheet">(
    tabParam === "team" ? "team" : tabParam === "worksheet" ? "worksheet" : tabParam === "analytics" ? "analytics" : "overview",
  );

  const { data: projectDetails, isLoading: projectDetailsLoading } = useQuery({
    queryKey: ["fetchSingleProjectDetails", projectId],
    queryFn: () => GetSingleProjectDetails(projectId as string, session),
  });

  // Extract Linear tool ID
  interface ITool {
    toolName: string;
    _id: string;
  }

  const toolId: string | null = projectDetails?.tools?.find((tool: ITool) => tool.toolName === "Linear")?._id || null;

  const { refetch: connectLinear, data: linearConnectData } = useQuery({
    queryKey: ["connectLinear", toolId],
    queryFn: () => ConnectLinear(toolId, session),
    enabled: false,
  });
  // console.log("🚀 ~ ProjectIdPage ~ linearConnectData:", linearConnectData?.redirectUri);

  if (linearConnectData?.redirectUri) {
    // window.open(linearConnectData.redirectUri, "_blank");
    router.push(linearConnectData.redirectUri);
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "overview" | "team" | "analytics" | "worksheet");

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleAuthorizeLinear = () => {
    if (toolId) {
      connectLinear();
    }
  };

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
          <GlobalBreadCrumb initialData="Projects" initalLink="/projects" secondayData="Project Details" />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading title={projectDetails?.name || ""} />
        {projectDetails?.tools.map(
          (tool: { id: string; toolName: string; connected: boolean }) =>
            tool.toolName === "Linear" &&
            !tool.connected && (
              <div key={tool.id} className="text-destructive border border-destructive rounded-lg flex gap-3 items-center p-4 mt-8">
                <CircleAlert />
                <h2 className="">
                  Authorize linear tool to see analytics data.{" "}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuthorizeLinear();
                    }}
                    className="underline cursor-pointer"
                  >
                    Authorize now
                  </span>
                </h2>
              </div>
            ),
        )}

        {/* tabs */}
        <div className="mb-3 flex flex-col items-start justify-between overflow-x-hidden md:mb-0 lg:flex-row lg:items-center">
          <div className="item-start flex w-full flex-col md:flex-row md:items-end md:gap-x-4 md:gap-y-0 lg:ml-2">
            <div className="flex justify-center gap-4 my-4 md:mb-6 md:mt-4">
              {/* Tabs: Unreported / Reported */}
              <Tabs
                value={activeTab} // Make it controlled by state
                className="text-[#64748B] w-full rounded-none"
                onValueChange={handleTabChange}
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
