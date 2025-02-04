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
import { GetDailyPerformance } from "../../../../../../../helpers/Team/teamApi"


const EfficiencyMemberDetails: React.FC = () => {
  const [pages, setPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("performance");
  const [limit] = useState<number>(10);

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

  const { id: member_id, date } = useParams() as { id: string; date: string };

  // console.log(date)

  const {
    data: dailyPerformance,
    isFetching: dailyPerformanceLoading,
    refetch: dailyPerformanceRefetch,
  } = useQuery<any>({
    queryKey: ["dailyPerformance", pages, limit],
    queryFn: () => GetDailyPerformance({ member_id, page: pages, limit, date }),
  });

  const dailyPerformanceData = dailyPerformance?.dailyPerformance?.data;

  console.log("Daily Performance", dailyPerformance?.dailyPerformance?.data);

  const totalCountAndLimit = {
    totalCount: dailyPerformance?.dailyPerformance?.count ?? 0,
    size: pagination.size ?? 10,
  };

  const individualAvatar =
    dailyPerformance?.userData.avatarUrls;
  const individualName =
    dailyPerformance?.userData.displayName;
  const individualDesignation =
    dailyPerformance?.userData.designation;

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
                <h1 className="pb-[3px] text-sm font-semibold">
                  {individualName}
                </h1>
                <p className="text-twelve text-miniSubheadingColor">
                  {individualDesignation}
                </p>
              </div>
            </div>
          </div>
        </div>
        <span className="flex justify-end mb-4">
          <CustomSingleDatePicker />
        </span>
        <div className="tab">
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
              className={`py-2 px-4 ${activeTab === "comments"
                ? "border-b-2 border-black font-semibold"
                : ""
                }`}
              onClick={() => setActiveTab("comments")}
            >
              Comments
            </button>
          </div>
        </div>
        <div className="mt-4">
          {activeTab === "performance" ? (


            <PerformanceTable
              totalCountAndLimit={totalCountAndLimit}
              performanceItems={dailyPerformanceData}
              loading={dailyPerformanceLoading}
              refetch={dailyPerformanceRefetch}
              currentPage={pages}
            />

          ) : (
            <div>Comments Content Coming Soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMemberDetails;
