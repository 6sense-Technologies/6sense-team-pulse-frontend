"use client";
import { Button } from "@/components/ButtonComponent";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";

import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useQuery } from "@tanstack/react-query";
import { GetProjectList } from "../../../../../helpers/projects/projectApi";
import { useSearchParams, useParams } from "next/navigation";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronDown, ChevronUp, FolderPlus, ListFilter } from "lucide-react";
import Link from "next/link";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import EmptyProjectView from "@/components/emptyProjectView";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import AvatarMenu from "@/components/AvatarMenu";
import Searchbar from "../../projects/_components/searchbar";
import { GetReportedworksheetList } from "../../../../../helpers/timelogs/timelogApi";
import { WorksheetTable } from "./_components/worksheetTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EmptyTimelogView from "../_components/emptyTimelogView";

const ReportedIdPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  //   console.log("🚀 ~ ReportedIdPage ~ selectedIds:", selectedIds);
  const [anySelected, setAnySelected] = useState(false);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const session = useSession();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const searchParams = useSearchParams();
  const params = useParams();
  const reportedId = typeof params.reportedId === "string" ? params.reportedId : null;
  console.log("🚀 ~ ReportedIdPage ~ reportedId:", reportedId);

  useEffect(() => {
    const newPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

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

  const [sort, setSortState] = useState<"latest" | "oldest">("latest");
  const [sortOpen, setSortOpen] = useState(false);

  function setSort(value: "latest" | "oldest") {
    setSortState(value);
    setSortOpen(false);
    // Optionally, trigger a refetch or update query params here if sorting affects data fetching
  }

  const {
    data: reportedWorksheetList,
    isFetching: reportedWorksheetListLoading,
    refetch: reportedWorksheetListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchReportedWorksheet", pages, limit, sort, searchText], // Add searchText to query key
    queryFn: () => GetReportedworksheetList({ page: pages, limit, sort, searchText }, reportedId, session),
  });
  console.log("🚀 ~ ReportedIdPage ~ reportedWorksheetList:", reportedWorksheetList);

  // console.log(projectList);

  const totalCountAndLimit = {
    totalCount: reportedWorksheetList?.paginationMetadata?.totalCount ?? 0,
    size: pagination.size ?? 10,
  };

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
          <GlobalBreadCrumb initialData="Time Log" initalLink="/timelog" secondayData="Worksheet Detail" secondayLink={`/timelog/${reportedId}`} />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading
          title={reportedWorksheetList?.projectName || ""}
          subTitle={reportedWorksheetList?.worksheetName ? `${reportedWorksheetList.worksheetName}` : ""}
        />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 items-center w-full lg:ml-2">
            <Searchbar
              placeholder="Search by activity"
              name="search"
              btntext="Search"
              className="mt-6 lg:mt-[18px] mb-[26px] gap-x-2 w-full md:max-w-[291px] relative"
              variant="light"
              disabled={false}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={(value) => {
                setSearchText(value);
                setPages(1); // Reset to first page on new search
                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                }));
                reportedWorksheetListRefetch(); // Refetch data with new search term
              }}
            />
            {/* Sort Dropdown */}
            <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
              <DropdownMenuTrigger className="px-3 flex gap-4 items-center">
                <div className="hidden md:flex">Sort {sortOpen ? <ChevronUp /> : <ChevronDown />}</div>
                <div className="md:hidden">
                  <ListFilter />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem className="flex font-normal" onClick={() => setSort("latest")}>
                  <ArrowUpNarrowWide /> Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("oldest")}>
                  <ArrowDownNarrowWide /> Oldest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full">
            <div className="flex justify-center md:justify-end">
              {selectedIds.length > 0 ? (
                // Show Remove button when items are selected
                <Button
                  variant="outline"
                  onClick={() => {
                    // Handle removal of selected items
                    console.log("Removing items with IDs:", selectedIds);
                    // Add your remove API call here
                  }}
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                >
                  Remove
                </Button>
              ) : (
                // Show last reported on when no items are selected
                <div className="flex justify-center md:justify-end gap-2 font-normal text-base leading-6">
                  <p className="text-subHeading">Last reported on</p>
                  <p>
                    {reportedWorksheetList?.lastReportedOn
                      ? new Date(reportedWorksheetList.lastReportedOn).toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }) +
                        " " +
                        new Date(reportedWorksheetList.lastReportedOn).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 lg:mt-0 lg:ml-2">
          {reportedWorksheetListLoading ? (
            <EmptyTableSkeleton /> // Show loader while data is being fetched
          ) : reportedWorksheetList?.data?.length === 0 ? (
            <EmptyTimelogView />
          ) : (
            //  Render the project table when there is data
            <WorksheetTable
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              totalCountAndLimit={totalCountAndLimit}
              projects={reportedWorksheetList?.data ?? []}
              loading={reportedWorksheetListLoading}
              refetch={reportedWorksheetListRefetch}
              currentPage={pages}
              reportedId={reportedId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportedIdPage;
