"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useParams, useSearchParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CustomSingleDatePicker } from "../_components/customSingleDatepicker";
import PerformanceTable from "../_components/performanceTable";
import { useQuery } from "@tanstack/react-query";
import { GetDailyPerformance, GetIndividualTeamMember } from "../../../../../../../helpers/Team/teamApi";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import TitleAvatarSkeleton from "@/components/titleAvatarSkeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

const EfficiencyMemberDetails: React.FC = () => {
  const [pages, setPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("performance");
  const [limit] = useState<number>(10);
  const session = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    setPages(newPage);
  }, [searchParams]);

  const { id: member_id, date } = useParams() as { id: string; date: string };

  const {
    data: individualMemberData,
    isFetching: individualMemberDataLoading,
  } = useQuery<any>({
    queryKey: ["individualMemberData", member_id],
    queryFn: () => GetIndividualTeamMember(member_id,session),
  });

  const {
    data: dailyPerformance,
    isFetching: dailyPerformanceLoading,
    refetch: dailyPerformanceRefetch,
  } = useQuery<any>({
    queryKey: ["dailyPerformance", pages, limit],
    queryFn: () => GetDailyPerformance({ member_id, page: pages, limit, date }, session),
  });

  const dailyPerformanceData = dailyPerformance?.dailyPerformance?.data;
  console.log("🚀 ~ dailyPerformanceData:", dailyPerformanceData)

  const totalCountAndLimit = {
    totalCount: dailyPerformance?.dailyPerformance?.count ?? 0,
    size: limit,
  };

  const individualAvatar = individualMemberData?.userData.avatarUrls;
  const individualName = individualMemberData?.userData.displayName;
  const individualDesignation = individualMemberData?.userData.designation;

  const getInitials = (name: string) => {
    if (!name) return "NA"; // Return default initials if name is undefined or empty
    const parts = name.split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="w-full">
      <PageTitle title="Performance Details • Ops4 Team" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
      <div className="md:hidden pb-4">
          <span className="md:hidden pl-1 "><SidebarTrigger /></span>
        </div>
        <GlobalBreadCrumb
          initialData="Team"
          initalLink="/team"
          secondayData="Profile"
          secondayLink={`/team/${member_id}/member-details`}
          thirdData="Daily Performance"
          thirdLink={`/team/${member_id}/member-details/${date}`}
        />
        <PageHeading
          title="Daily Performance"
          titleclassName="font-medium"
          className="pl-2 pt-3"
        />
        <div className="flex items-center justify-between md:mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-1 md:mb-0">
            <div className="flex flex-row md:gap-x-4 md:gap-y-0 item-start md:items-center mr-4">
              {individualMemberDataLoading ? (
               <span className="ml-5 mr-2 mt-8 mb-6"><TitleAvatarSkeleton/></span>
              ) : (
                <>
                  <div>
                    <Avatar className="w-16 h-16 rounded-full ml-5 mr-2 mt-8 mb-6">
                      {individualAvatar ? (
                        <AvatarImage src={individualAvatar} alt="Avatar" />
                      ) : (
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(individualName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="pl-2 pt-11 md:pt-1 md:pl-0">
                    <h1 className="pb-[3px] text-sm font-semibold">
                      {individualName}
                    </h1>
                    <p className="text-twelve text-miniSubheadingColor">
                      {individualDesignation}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <span className="flex justify-end">
          <span className="cursor-not-allowed">
          <CustomSingleDatePicker />
          </span>
        </span>
        <div className="tab lg:ml-2">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${
                activeTab === "performance"
                  ? "border-b-2 border-black font-semibold"
                  : ""
              }`}
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </button>
            <button
              className={`py-2 px-4 cursor-not-allowed text-gray-400 ${
                activeTab === "comments"
                  ? "border-b-2 border-black font-semibold"
                  : ""
              }`}
              onClick={(e) => e.preventDefault()}
            >
              Comments
            </button>
          </div>
        </div>
        <div className="mt-4 lg:ml-2">
          {activeTab === "performance" ? (
            dailyPerformanceLoading ? (
              <EmptyTableSkeleton /> // Show loader while data is being fetched
            ) : (
              <PerformanceTable
                totalCountAndLimit={totalCountAndLimit}
                performanceItems={dailyPerformanceData}
                loading={dailyPerformanceLoading}
                refetch={dailyPerformanceRefetch}
                currentPage={pages}
              />
            )
          ) : (
            <div>Comments Content Coming Soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMemberDetails;