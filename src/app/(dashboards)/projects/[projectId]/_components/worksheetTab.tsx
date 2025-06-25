"use client";

import React, { useState } from "react";
import { GetProjectWorksheetList, GetProjectWorksheetPerformance } from "../../../../../../helpers/projects/projectApi";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ButtonComponent";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import EmptyTimelogView from "@/app/(dashboards)/timelog/_components/emptyTimelogView";
import { ProjectWorksheetTable } from "./projectWorksheetTable";
import EmptyWorksheetView from "./emptyWorksheetView";

const WorksheetTab = ({ projectId }: { projectId: string }) => {
  const [limit] = useState(10);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });
  const [pages, setPages] = useState(1);
  const [date, setDate] = useState<Date>(new Date());

  //   console.log("🚀 ~ WorksheetTab ~ projectId:", projectId);
  const session = useSession();

  const { data: projectWorksheetPerformance, isFetching: projectWorksheetPerformanceLoading } = useQuery({
    queryKey: ["fetchProjectWorksheetPerformance"],
    queryFn: () => GetProjectWorksheetPerformance(session, { "project-id": projectId }),
  });

  // Query: Fetch Worksheet
  const {
    data: worksheetList,
    isFetching: worksheetListLoading,
    refetch: worksheetListRefetch,
  } = useQuery<any>({
    queryKey: [
      "fetchWorksheetList",
      pages,
      // limit, formattedStartDate, formattedEndDate, sort
    ],
    queryFn: () =>
      GetProjectWorksheetList(
        {
          projectId: projectId,
          page: pages,
          limit,
          //   startDate: formattedStartDate || format(new Date(), "yyyy-MM-dd"),
          //   endDate: formattedEndDate || format(addDays(new Date(), 7), "yyyy-MM-dd"),
          //   sort,
        },
        session,
      ),
    // enabled: activeTab === "reported" && !!formattedStartDate && !!formattedEndDate,
  });
  console.log("🚀 ~ WorksheetTab ~ worksheetList:", worksheetList);

  // Setup for pagination handling
  const totalCountAndLimit = {
    totalCount: worksheetList?.paginationMetadata?.totalCount ?? 0,
    size: pagination.size ?? 10,
  };
  return (
    <div>
      {/* performance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">Today</p>
          <h1 className="font-medium mt-2">
            {projectWorksheetPerformance?.today?.hours === 0 && projectWorksheetPerformance?.today?.minutes === 0
              ? "00:00"
              : `${projectWorksheetPerformance?.today.hours}h ${projectWorksheetPerformance?.today.minutes}m`}
          </h1>
        </div>
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">This Week</p>
          <h1 className="font-medium mt-2">
            {projectWorksheetPerformance?.thisWeek?.hours === 0 && projectWorksheetPerformance?.thisWeek?.minutes === 0
              ? "00:00"
              : `${projectWorksheetPerformance?.thisWeek.hours}h ${projectWorksheetPerformance?.thisWeek.minutes}m`}
          </h1>
        </div>
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">This Month</p>
          <h1 className="font-medium mt-2">
            {projectWorksheetPerformance?.thisMonth?.hours === 0 && projectWorksheetPerformance?.thisMonth?.minutes === 0
              ? "00:00"
              : `${projectWorksheetPerformance?.thisMonth.hours}h ${projectWorksheetPerformance?.thisMonth.minutes}m`}
          </h1>
        </div>
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">All Time</p>
          <h1 className="font-medium mt-2">
            {projectWorksheetPerformance?.allTime?.hours === 0 && projectWorksheetPerformance?.allTime?.minutes === 0
              ? "00:00"
              : `${projectWorksheetPerformance?.allTime.hours}h ${projectWorksheetPerformance?.allTime.minutes}m`}
          </h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden py-6 ">
        <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 items-center w-full lg:ml-2">
          searchbar
          {/* <Searchbar
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
          /> */}
          {/* Sort Dropdown */}
          {/* <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
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
          </DropdownMenu> */}
        </div>
        <div className="w-full">
          {/* date picker */}
          <div className="flex justify-center md:justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("flex items-center gap-2 justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{date ? format(date, "PPP") : "Pick a date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                {/* Single date picker (unreported tab) */}
                <Calendar
                  mode="single"
                  selected={date}
                  defaultMonth={date} // Add this line to focus on the selected date's month
                  disabled={{ after: new Date() }}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                      setPages(1);
                      setPagination((prev) => ({
                        ...prev,
                        page: 1,
                      }));
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", "1");
                      router.replace(`${pathname}?${params.toString()}`);
                    }
                  }}
                  initialFocus
                  classNames={{
                    day_selected: "bg-black text-white hover:bg-[#0F172A] hover:text-white",
                    day_today: "",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div>
        {worksheetListLoading ? (
          <EmptyTableSkeleton />
        ) : worksheetList?.data?.length === 0 ? (
          <EmptyWorksheetView />
        ) : (
          <ProjectWorksheetTable
            totalCountAndLimit={totalCountAndLimit}
            worksheets={worksheetList?.data ?? []}
            loading={worksheetListLoading}
            refetch={worksheetListRefetch}
            currentPage={pages}
          />
        )}
      </div>
    </div>
  );
};

export default WorksheetTab;
