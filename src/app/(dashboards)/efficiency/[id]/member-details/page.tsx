"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useSearchParams } from "next/navigation";
import { TeamDetailsTable } from "./_components/TeamDetailsTable";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarArrowDown, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ButtonComponent";
import { CustomDatePicker } from "./_components/customDatePicker";

const TeamList = [
  {
    date: "2023-10-01",
    tasks: { planned: 5, unplanned: 2, TCR: 3 },
    bugs: 1,
    stories: { No: 4, USCR: 2 },
    score: 85,
    insight: "Good performance",
  },
  {
    date: "2023-10-02",
    tasks: { planned: 6, unplanned: 1, TCR: 4 },
    bugs: 0,
    stories: { No: 5, USCR: 3 },
    score: 90,
    insight: "Excellent performance",
  },
  {
    date: "2023-10-03",
    tasks: { planned: 4, unplanned: 3, TCR: 2 },
    bugs: 2,
    stories: { No: 3, USCR: 1 },
    score: 88,
    insight: "Consistent performance",
  },
  {
    date: "2023-10-04",
    tasks: { planned: 7, unplanned: 0, TCR: 5 },
    bugs: 1,
    stories: { No: 6, USCR: 4 },
    score: 92,
    insight: "Outstanding performance",
  },
  {
    date: "2023-10-05",
    tasks: { planned: 3, unplanned: 2, TCR: 1 },
    bugs: 3,
    stories: { No: 2, USCR: 1 },
    score: 87,
    insight: "Needs improvement in bug handling",
  },
  {
    date: "2023-10-06",
    tasks: { planned: 5, unplanned: 1, TCR: 4 },
    bugs: 0,
    stories: { No: 4, USCR: 2 },
    score: 89,
    insight: "Great performance",
  },
  {
    date: "2023-10-07",
    tasks: { planned: 4, unplanned: 3, TCR: 2 },
    bugs: 2,
    stories: { No: 3, USCR: 1 },
    score: 84,
    insight: "Consistent performance",
  },
  {
    date: "2023-10-08",
    tasks: { planned: 6, unplanned: 1, TCR: 5 },
    bugs: 1,
    stories: { No: 5, USCR: 3 },
    score: 91,
    insight: "Excellent performance",
  },
  {
    date: "2023-10-09",
    tasks: { planned: 5, unplanned: 2, TCR: 3 },
    bugs: 1,
    stories: { No: 4, USCR: 2 },
    score: 86,
    insight: "Good performance",
  },
  {
    date: "2023-10-10",
    tasks: { planned: 7, unplanned: 0, TCR: 6 },
    bugs: 0,
    stories: { No: 6, USCR: 4 },
    score: 93,
    insight: "Outstanding performance",
  },
];

const EfficiencyMemberDetails: React.FC = () => {
  const [pages, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<string>("profile");

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
    totalCount: TeamList.length,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
      <PageTitle title="Team Efficiency • Ops4 Team" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
        <GlobalBreadCrumb
          initialData="Team"
          initalLink="/efficiency"
          secondayData="Profile"
          secondayLink="/team-efficiency/id/profile"
        />
        <PageHeading
          title="Faisal's Profile"
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
            <div className="flex gap-x-[10px]">
              <div>
                <div className="flex items-center gap-x-[6px]">
                  <CalendarCheck2 size={16} />
                  <h1 className="text-[18px] font-semibold">90.67%</h1>
                </div>
                <p className="text-sm text-miniSubheadingColor">
                  Current Month Performance
                </p>
              </div>
              <div>
                <div className="flex items-center gap-x-[6px]">
                  <CalendarArrowDown size={16} />
                  <h1 className="text-[18px] font-semibold">93.01%</h1>
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
                activeTab === "profile" ? "border-b-2 border-black font-semibold" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "performance" ? "border-b-2 border-black font-semibold" : ""
              }`}
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </button>
          </div>
        </div>
        <div className="mt-4">
          {activeTab === "profile" ? (
            <div>Coming Soon</div>
          ) : (
            <>
              <span className="flex justify-end mb-4">
                <CustomDatePicker />
              </span>
              <TeamDetailsTable
                totalCountAndLimit={totalCountAndLimit}
                teamMembers={TeamList}
                currentPage={pages}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMemberDetails;
