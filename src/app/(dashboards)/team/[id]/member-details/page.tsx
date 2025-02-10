"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useParams, useSearchParams } from "next/navigation";
import { TeamDetailsTable } from "./_components/TeamDetailsTable";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarArrowDown, CalendarCheck2, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ButtonComponent";
import { CustomDatePicker } from "./_components/customDatePicker";
import { GetIndividualOverview, GetIndividualTeamMember } from "../../../../../../helpers/Team/teamApi";
import { useQuery } from "@tanstack/react-query";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import TextSkeleton from "@/components/textSkeleton";
import SummarySkeleton from "@/components/summarySkeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

const getInitials = (name: string) => {
  if (!name) return "NA"; // Return default initials if name is undefined or empty
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const EfficiencyMemberDetails: React.FC = () => {
  const [pages, setPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<string>("performance");

  const { id } = useParams() as { id: string };

  const searchParams = useSearchParams();
  const session = useSession();

  useEffect(() => {
    const newPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    setPages(newPage);
  }, [searchParams]);

  const {
    data: individualMemberData,
    isFetching: individualMemberDataLoading,
  } = useQuery<any>({
    queryKey: ["individualMemberData", id],
    queryFn: () => GetIndividualTeamMember(id,session),
  });

  const {
    data: individualOverview,
    isFetching: individualOverviewLoading,
    refetch: individualOverviewRefetch,
  } = useQuery<any>({
    queryKey: ["individualOverview", pages, limit],
    queryFn: () => GetIndividualOverview({ member_id: id, page: pages, limit },session),
  });

  const individualAvatar = individualMemberData?.userData.avatarUrls;
  const individualName = individualMemberData?.userData.displayName;
  const firstName = individualName?.split(' ')[0];
  const individualDesignation = individualMemberData?.userData.designation;
  const individualCurrentMonthPerformance =
    individualMemberData?.currentMonthScore;
  const individualLastMonthPerformance = individualMemberData?.lastMonthScore;

  const formattedCurrentMonthPerformance =
    individualCurrentMonthPerformance !== undefined
      ? `${(Math.ceil(individualCurrentMonthPerformance * 100) / 100).toFixed(
        2
      )}%`
      : "-";

  const formattedLastMonthPerformance =
    individualLastMonthPerformance !== undefined
      ? `${(Math.ceil(individualLastMonthPerformance * 100) / 100).toFixed(2)}%`
      : "-";

  const totalCountAndLimit = {
    totalCount: individualOverview?.history.count ?? 0,
    size: limit,
  };

  return (
    <div className="w-full">
      <PageTitle title="Member Details • Ops4 Team" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
        <div className="md:hidden pb-4">
          <span className="md:hidden pl-1 "><SidebarTrigger /></span>
        </div>
        <GlobalBreadCrumb
          initialData="Team"
          initalLink="/team"
          secondayData="Performance"
          secondayLink="/team/id/profile"
        />
        {individualMemberDataLoading ? (
          <TextSkeleton className="h-8 w-48 ml-3 mt-3 mb-4" />
        ) : (
          <PageHeading
            title={`${firstName}'s Performance`}
            titleclassName="font-medium"
            className="pl-2 pt-3"
          />
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col md:flex-row md:gap-x-10 items-start md:items-center mb-3 md:mb-0">
            {individualMemberDataLoading ? (
              <span className="pl-3 pt-3"><SummarySkeleton /></span>
            ) : (
              <>
                <div className="flex flex-row md:gap-x-4 md:gap-y-0 item-start md:items-center mr-4">
                  <div>
                    <Avatar className="w-16 h-16 rounded-full ml-4 mr-2 mt-8 mb-6">
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
                    <h1 className="pb-[3px] text-sm text-[#334155] font-semibold">
                      {individualName}
                    </h1>
                    <p className="text-twelve text-[#334155]">
                      {individualDesignation}
                    </p>
                  </div>
                </div>
                <div className="pl-6 md:pl-0 flex gap-x-[14px] md:gap-x-[10px]">
                  <div className="pt-1 md:pt-0">
                    <div className="flex items-center gap-x-[6px]">
                      <CalendarCheck2 size={16} />
                      <h1 className="md:text-[18px] font-semibold">
                        {formattedCurrentMonthPerformance}
                      </h1>
                    </div>
                    <p className="text-twelve md:text-sm text-miniSubheadingColor">
                      Current Month Performance
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-x-[6px]">
                      <CalendarArrowDown size={16} />
                      <h1 className="text-[18px] font-semibold">
                        {formattedLastMonthPerformance}
                      </h1>
                    </div>
                    <p className="text-twelve md:text-sm text-miniSubheadingColor">
                      Last Month Performance
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <span className="hidden md:block">
            <Button variant="light">Edit Profile</Button>
          </span>
          <span className="md:hidden pb-16 pr-2 md:pb-0 md:pr-0 cursor-not-allowed">
            <span><EllipsisVertical size={16}/></span>
          </span>
        </div>
        <div className="tab lg:ml-2 ">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${activeTab === "performance"
                ? "border-b-2 border-black font-semibold"
                : ""
                }`}
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </button>
            <button
              className={`py-2 px-4 cursor-not-allowed text-gray-400${activeTab === "profile"
                ? "border-b-2 border-black font-semibold"
                : ""
                }`}
              onClick={(e) => e.preventDefault()}
            >
              Profile
            </button>
          </div>
        </div>
        <div className="mt-4 lg:ml-2">
          {activeTab === "performance" ? (
            <>
              <span className="flex justify-end mb-4">
                <span className="cursor-not-allowed">
                  <CustomDatePicker />
                </span>
              </span>
              {individualOverviewLoading ? (
                <EmptyTableSkeleton />
              ) : (
                <TeamDetailsTable
                  totalCountAndLimit={totalCountAndLimit}
                  teamMembers={individualOverview?.history.data ?? []}
                  loading={individualOverviewLoading}
                  refetch={individualOverviewRefetch}
                  currentPage={pages}
                  Memberid={id}
                />
              )}
            </>
          ) : (
            <div>Coming Soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMemberDetails;