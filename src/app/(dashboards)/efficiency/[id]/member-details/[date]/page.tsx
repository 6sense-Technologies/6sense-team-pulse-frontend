"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarArrowDown, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ButtonComponent";
import { CustomSingleDatePicker } from "../_components/customSingleDatepicker";
import PerformanceTable from "../_components/performanceTable";

const performanceList = [
  {
    category: "Development",
    workItem: "Feature Implementation",
    linkedID: "DEV-123",
    status: "Completed",
  },
  {
    category: "Testing",
    workItem: "Unit Testing",
    linkedID: "TEST-789",
    status: "In Progress",
  },
  {
    category: "Bug Fixing",
    workItem: "Critical Bug Fix",
    linkedID: "BUG-112",
    status: "Pending",
  },
  {
    category: "Deployment",
    workItem: "Production Deployment",
    linkedID: "DEP-114",
    status: "Completed",
  },
  {
    category: "Code Review",
    workItem: "Peer Review",
    linkedID: "CR-116",
    status: "In Progress",
  },
];

const EfficiencyMemberDetails: React.FC = () => {
  const [pages, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<string>("performance");

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

  const totalCountAndLimit = {
    totalCount: performanceList.length,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
      <PageTitle title="Team Efficiency • Ops4 Team" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
        <GlobalBreadCrumb
          initialData="Profile"
          initalLink="/efficiency"
          secondayData="Daily Performance"
          secondayLink="/team-efficiency/id/member-details/date"
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
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Avatar"
                  />
                  <AvatarFallback>{"AA"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="pt-1">
                <h1 className="pb-[3px] text-sm font-semibold">
                  Khan Atik Faisal
                </h1>
                <p className="text-twelve text-miniSubheadingColor">
                  Junior Software Engineer
                </p>
              </div>
            </div>
          </div>
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
                activeTab === "comments"
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
            <>
              <span className="flex justify-end mb-4">
                <CustomSingleDatePicker />
              </span>
              <PerformanceTable
                totalCountAndLimit={totalCountAndLimit}
                performanceItems={performanceList}
                currentPage={pages}
              />
            </>
          ) : (
            <div>Comments Content Coming Soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMemberDetails;