"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useParams, useSearchParams } from "next/navigation";
import { TeamDetailsTable } from "./_components/TeamDetailsTable";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarArrowDown, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ButtonComponent";
import { CustomDatePicker } from "./_components/customDatePicker";
import { GetIndividualOverview } from "../../../../../../helpers/Team/teamApi"
import { useQuery } from "@tanstack/react-query";

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

  interface Pagination {
    page: number;
    size: number;
  }

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const newPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    setPages(newPage);
    // Only update pagination if the new page is different from the current page
    setPagination((prevPagination) => {
      if (prevPagination.page !== newPage) {
        return {
          page: newPage,
          size: prevPagination.size,
        };
      }
      return prevPagination; // Return the previous state if no change
    });
  }, [searchParams]);

  const {
    data: individualOverview,
    isFetching: individualOverviewLoading,
    refetch: individualOverviewRefetch,
  } = useQuery<any>({
    queryKey: ["individualOverview", pages, limit],
    queryFn: () => GetIndividualOverview({ member_id: id, page: pages, limit }),
  });

  console.log("Individual", individualOverview);

  const individualAvatar = individualOverview?.userData.avatarUrls;
  const individualName = individualOverview?.userData.displayName;
  const firstName = individualName?.split(' ')[0];
  const individualDesignation = individualOverview?.userData.designation;
  const individualCurrentMonthPerformance =
    individualOverview?.currentMonthScore;
  const individualLastMonthPerformance = individualOverview?.lastMonthScore;

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

  console.log(individualOverview?.history.data);

  const totalCountAndLimit = {
    totalCount: individualOverview?.history.count ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
      <PageTitle title="Member Details • Ops4 Team" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
        <GlobalBreadCrumb
          initialData="Team"
          initalLink="/team"
          secondayData="Profile"
          secondayLink="/team/id/profile"
        />
        <PageHeading
          title={`${firstName}'s Profile`}
          titleclassName="font-medium"
          className="pl-2 pt-3"
        />
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-3 md:mb-0">
            <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-center mr-4">
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
              <div className="pt-1">
                <h1 className="pb-[3px] text-sm text-[#334155] font-semibold">
                  {individualName}
                </h1>
                <p className="text-twelve text-[#334155]">
                  {individualDesignation}
                </p>
              </div>
            </div>
            <div className="flex gap-x-[10px]">
              <div>
                <div className="flex items-center gap-x-[6px]">
                  <CalendarCheck2 size={16} />
                  <h1 className="text-[18px] font-semibold">
                    {formattedCurrentMonthPerformance}
                  </h1>
                </div>
                <p className="text-sm text-miniSubheadingColor">
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
                <p className="text-sm text-miniSubheadingColor">
                  Last Month Performance
                </p>
              </div>
            </div>
          </div>
          <Button variant="light">Edit Profile</Button>
        </div>
        <div className="tab">
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
              className={`py-2 px-4 ${
                activeTab === "profile"
                  ? "border-b-2 border-black font-semibold"
                  : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </div>
        </div>
        <div className="mt-4">
          {activeTab === "performance" ? (

            <>
            <span className="flex justify-end mb-4">
            <CustomDatePicker />
            </span>
            <TeamDetailsTable
            totalCountAndLimit={totalCountAndLimit}
            teamMembers={individualOverview?.history.data ?? []}
            loading={individualOverviewLoading}
            refetch={individualOverviewRefetch}
            currentPage={pages}
            Memberid={id}
            />
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


