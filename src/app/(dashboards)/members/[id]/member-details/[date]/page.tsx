"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CustomSingleDatePicker } from "../_components/customSingleDatepicker";
import PerformanceTable from "../_components/performanceTable";
import { useQuery } from "@tanstack/react-query";
import { GetDailyPerformance, GetGitCalculations, GetGitData, GetIndividualTeamMember } from "../../../../../../../helpers/Member/memberApi";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import TitleAvatarSkeleton from "@/components/titleAvatarSkeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import AvatarMenu from "@/components/AvatarMenu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Activity, ChartPie, ChartSpline, List, TrendingDown, TrendingUp } from "lucide-react";
import { GitTable } from "./_components/gitTable";
import GitCards from "./_components/gitcards";
import comingSoonAlert from "@/components/comingSoonAlert";
import { Toaster } from "@/components/ui/toaster";

const EfficiencyMemberDetails: React.FC = () => {
  const [pages, setPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [view, setView] = useState<string>("Table");
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { id: member_id, date } = useParams() as { id: string; date: string };

  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("tab") === "git" ? "git" : "items"
  );

  useEffect(() => {
    const newPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    setPages(newPage);
  }, [searchParams]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newUrl = `${window.location.pathname}?tab=${tab}`;
    router.push(newUrl);
  };

  const {
    data: individualMemberData,
    isFetching: individualMemberDataLoading,
  } = useQuery<any>({
    queryKey: ["individualMemberData", member_id],
    queryFn: () => GetIndividualTeamMember(member_id, session),
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

  const {
    data: gitDetails,
    isFetching: gitDetailsLoading,
    refetch: gitDetailsRefetch,
  } = useQuery<any>({
    queryKey: ["gitDetails", pages, limit],
    queryFn: () => GetGitData({ member_id, date }, session),
  });

  const {
    data: gitCalculations,
  } = useQuery<any>({
    queryKey: ["gitCalculations", pages, limit],
    queryFn: () => GetGitCalculations({ member_id, date }, session),
  });
    console.log("🚀 ~ gitCalculations:", gitCalculations)

  const gitTotalCountAndLimit = {
    totalCount: gitDetails?.totalCount ?? 0,
    size: limit,
  };

  
  const formatNumber = (num: string | undefined) => {
    const number = parseFloat(num ?? "0");
    return num !== undefined ? number.toFixed(2) : "0.00";
  };

  return (
    <div className="w-full">
      <PageTitle title="Performance Details • Ops4 Team" />
        <Toaster/>
      <div className="pl-4 pt-8 pr-[14px] w-full">
        <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1 "><SidebarTrigger /></span>
          <AvatarMenu />
        </div>
        <div className="flex justify-between items-center">
          <GlobalBreadCrumb
            initialData="Members"
            initalLink="/members"
            secondayData="Performance"
            secondayLink={`/members/${member_id}/member-details`}
            thirdData="Daily Performance"
            thirdLink={`/members/${member_id}/member-details/${date}`}
          />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading
          title="Daily Performance"
          titleclassName="font-medium"
          className="pl-2 pt-1"
        />
        <div className="flex items-center justify-between md:mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-1 md:mb-0">
            <div className="flex flex-row md:gap-x-4 md:gap-y-0 item-start md:items-center mr-4">
              {individualMemberDataLoading ? (
                <span className="ml-5 mr-2 mt-8 mb-6"><TitleAvatarSkeleton /></span>
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
        <div className="tab lg:ml-2">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${activeTab === "items" ? "border-b-2 border-black font-semibold" : ""}`}
              onClick={() => handleTabChange("items")}
            >
              Items
            </button>
            <button
              className={`py-2 px-4 ${activeTab === "git" ? "border-b-2 border-black text-black font-semibold" : ""}`}
              onClick={() => handleTabChange("git")}
            >
              Git
            </button>
          </div>
        </div>
        <div className="mt-4 lg:ml-2">
          {activeTab === "items" ? (
            dailyPerformanceLoading ? (
              <EmptyTableSkeleton />
            ) : (
              <>
                <span className="flex justify-end pb-4">
                  <span className="cursor-not-allowed">
                    <CustomSingleDatePicker />
                  </span>
                </span>
                <PerformanceTable
                  totalCountAndLimit={totalCountAndLimit}
                  performanceItems={dailyPerformanceData}
                  loading={dailyPerformanceLoading}
                  refetch={dailyPerformanceRefetch}
                  currentPage={pages}
                />
              </>
            )
          ) : (
            <>
              <span className="flex justify-end pb-4">
                <span className="cursor-not-allowed">
                  <CustomSingleDatePicker />
                </span>
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                <GitCards
                  icon={TrendingUp}
                  subheading="Total Additions"
                  amount={gitCalculations?.summary?.totalAdditionsSum ?? "0"}
                  bgColor="bg-[#DCFCE7]"
                  iconColor="text-[#166534]"
                  tooltipMessage="Total lines of code added"
                />
                <GitCards
                  icon={TrendingDown}
                  subheading="Total Deletions"
                  amount={gitCalculations?.summary?.totalDeletionsSum ?? "0"}
                  bgColor="bg-[#FEF2F2]"
                  iconColor="text-[#B91C1C]"
                  tooltipMessage="Total lines of code deleted"
                />
                <GitCards
                  icon={ChartPie}
                  subheading="Total Contributions"
                  amount={gitCalculations?.summary?.totalContributions ?? "0"}
                  bgColor="bg-[#F1F5F9]"
                  iconColor="text-[#030712]"
                  tooltipMessage="Net additions after deletions for all contributions"
                />
                <GitCards
                  icon={Activity}
                  subheading="Code Churn"
                  amount={formatNumber(gitCalculations?.summary?.codeChurn)}
                  bgColor="bg-[#F1F5F9]"
                  iconColor="text-[#030712]"
                  isPercentage={true}
                  tooltipMessage="Percentage of lines deleted relative to total additions"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <h1 className="text-[16px] font-semibold">Git Contribution</h1>
                <div>
                  <ToggleGroup type="single" value={view} onValueChange={(value) => setView(value)}>
                    <ToggleGroupItem value="Chart" onClick={comingSoonAlert}>
                      <ChartSpline size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Table">
                      <List size={16} />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <div className="mt-4">
                <GitTable
                  totalCountAndLimit={gitTotalCountAndLimit}
                  performanceItems={gitDetails?.data}
                  loading={gitDetailsLoading}
                  refetch={gitDetailsRefetch}
                  currentPage={pages}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMemberDetails;