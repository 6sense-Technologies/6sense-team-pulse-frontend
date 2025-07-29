"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetProjectWorksheetList, GetProjectWorksheetPerformance } from "../../../../../../helpers/projects/projectApi";
import { Button } from "@/components/ButtonComponent";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Searchbar from "../../_components/searchbar";
import EmptyWorksheetView from "./emptyWorksheetView";
import { ProjectWorksheetTable } from "./projectWorksheetTable";
import { CalendarIcon, ChevronDown, ChevronUp, CircleAlert, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

const WorksheetTab = ({ projectId }: { projectId: string }) => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);

  // Filter and search state
  const [searchText, setSearchText] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [sortBy, setSortBy] = useState<string>("reportedTime");
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [sortOpen, setSortOpen] = useState(false);

  // Formatted values
  const formattedDate = format(date, "yyyy-MM-dd");

  // Update pagination from URL params
  useEffect(() => {
    const newPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    setPages(newPage);

    setPagination((prevPagination) => {
      if (prevPagination.page !== newPage) {
        return { page: newPage, size: prevPagination.size };
      }
      return prevPagination;
    });
  }, [searchParams]);

  // Performance data query
  const { data: projectWorksheetPerformance, isFetching: projectWorksheetPerformanceLoading } = useQuery({
    queryKey: ["fetchProjectWorksheetPerformance"],
    queryFn: () => GetProjectWorksheetPerformance(session, { "project-id": projectId }),
  });

  // Worksheet list query
  const {
    data: worksheetList,
    isFetching: worksheetListLoading,
    refetch: worksheetListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchWorksheetList", pages, formattedDate, searchText, sortBy, sortOrder],
    queryFn: () =>
      GetProjectWorksheetList(
        {
          projectId,
          page: pages,
          limit,
          startDate: formattedDate,
          endDate: formattedDate,
          searchText,
          sortBy,
          sortOrder,
        },
        session,
      ),
  });

  // Handle search submission
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPages(1);
    setPagination((prev) => ({ ...prev, page: 1 }));

    // Update URL to reflect page change
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle sort selection
  const handleSort = (sortByValue: string, sortOrderValue: string) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setSortOpen(false);

    // Reset to first page
    setPages(1);
    setPagination((prev) => ({ ...prev, page: 1 }));

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setPages(1);
      setPagination((prev) => ({ ...prev, page: 1 }));

      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const totalCountAndLimit = {
    totalCount: worksheetList?.paginationMetadata?.totalCount ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div>
      {/* Performance Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Today Performance */}
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">Today</p>
          {projectWorksheetPerformanceLoading ? (
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h1 className="font-medium mt-2">
              {projectWorksheetPerformance?.today?.hours == null || projectWorksheetPerformance?.today?.minutes == null
                ? "00h 00m"
                : projectWorksheetPerformance?.today.hours === 0 && projectWorksheetPerformance?.today.minutes === 0
                  ? "00h 00m"
                  : `${projectWorksheetPerformance?.today.hours}h ${projectWorksheetPerformance?.today.minutes}m`}
            </h1>
          )}
        </div>

        {/* This Week Performance */}
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">This Week</p>
          {projectWorksheetPerformanceLoading ? (
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h1 className="font-medium mt-2">
              {projectWorksheetPerformance?.thisWeek?.hours == null || projectWorksheetPerformance?.thisWeek?.minutes == null
                ? "00h 00m"
                : projectWorksheetPerformance?.thisWeek.hours === 0 && projectWorksheetPerformance?.thisWeek.minutes === 0
                  ? "00h 00m"
                  : `${projectWorksheetPerformance?.thisWeek.hours}h ${projectWorksheetPerformance?.thisWeek.minutes}m`}
            </h1>
          )}
        </div>

        {/* This Month Performance */}
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">This Month</p>
          {projectWorksheetPerformanceLoading ? (
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h1 className="font-medium mt-2">
              {projectWorksheetPerformance?.thisMonth?.hours == null || projectWorksheetPerformance?.thisMonth?.minutes == null
                ? "00h 00m"
                : projectWorksheetPerformance?.thisMonth.hours === 0 && projectWorksheetPerformance?.thisMonth.minutes === 0
                  ? "00h 00m"
                  : `${projectWorksheetPerformance?.thisMonth.hours}h ${projectWorksheetPerformance?.thisMonth.minutes}m`}
            </h1>
          )}
        </div>

        {/* All Time Performance */}
        <div className="border rounded-lg px-4 py-2">
          <p className="font-normal text-sm text-gray-500">All Time</p>
          {projectWorksheetPerformanceLoading ? (
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h1 className="font-medium mt-2">
              {projectWorksheetPerformance?.allTime?.hours == null || projectWorksheetPerformance?.allTime?.minutes == null
                ? "00h 00m"
                : projectWorksheetPerformance?.allTime.hours === 0 && projectWorksheetPerformance?.allTime.minutes === 0
                  ? "00h 00m"
                  : `${projectWorksheetPerformance?.allTime.hours}h ${projectWorksheetPerformance?.allTime.minutes}m`}
            </h1>
          )}
        </div>
      </div>
      {/* Filters and Search Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden py-6 ">
        <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 items-center w-full lg:ml-2">
          {/* Search Bar */}
          <Searchbar
            placeholder="Search by work sheet"
            name="search"
            btntext="Search"
            className="mt-6 lg:mt-[18px] mb-[26px] gap-x-2 w-full md:max-w-[291px] relative"
            variant="light"
            disabled={false}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSubmit={handleSearch}
          />

          {/* Sort/Filter Dropdown */}
          <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
            <DropdownMenuTrigger
              className={cn("px-3 flex gap-4 items-center", sortOpen ? "border-2 border-black rounded-md px-3 py-1.5" : "border-0")}
            >
              <div className="hidden md:flex">Filter {sortOpen ? <ChevronUp /> : <ChevronDown />}</div>
              <div className="md:hidden">
                <ListFilter />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {/* Sort by Reported Time */}
              <DropdownMenuLabel className="font-semibold text-sm">Sort by Reported Time</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort("reportedTime", "latest")}>Latest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("reportedTime", "oldest")}>Oldest</DropdownMenuItem>
              </DropdownMenuGroup>

              <hr className="my-2" />

              {/* Sort by Time Spent */}
              <DropdownMenuLabel className="font-semibold text-sm">Sort by Time Spent</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort("duration", "highest")}>Highest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("duration", "lowest")}>Lowest</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date Picker */}
        <div className="w-full">
          <div className="flex justify-center md:justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("flex items-center gap-2 justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{date ? format(date, "PPP") : "Pick a date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  defaultMonth={date}
                  disabled={{ after: new Date() }}
                  onSelect={handleDateSelect}
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
      {/* Worksheet Table Section */}
      <div>
        {worksheetListLoading ? (
          <EmptyTableSkeleton />
        ) : worksheetList?.data?.length === 0 ? (
          <EmptyWorksheetView />
        ) : (
          <ProjectWorksheetTable
            projectId={projectId}
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
