"use client";

import AvatarMenu from "@/components/AvatarMenu";
import { Button } from "@/components/ButtonComponent";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { addDays, format, subDays } from "date-fns";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, CalendarIcon, ChevronDown, ChevronUp, ListFilter } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import EmptyTimelogView from "./_components/emptyTimelogView";
import { TimelogTable } from "./_components/timelogTable";
import { GetTimelogListReported, GetTimelogListUnreported } from "../../../../helpers/timelogs/timelogApi";
import AddReportedModal from "./_components/addReportedModal";
import { TimelogReportedListTable } from "./_components/timelogReportedListTable";
import CreateLogModal from "./_components/createLogModal";

const TimelogPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"unreported" | "reported">(tabParam === "reported" ? "reported" : "unreported");
  const session = useSession();

  const [date, setDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7), // 7 days ago
    to: new Date(), // Today
  });

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const formattedStartDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const formattedEndDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const router = useRouter();
  const pathname = usePathname();

  // Effects
  useEffect(() => {
    const newPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    setPages(newPage);

    // Update pagination only if page has changed
    setPagination((prevPagination) => {
      if (prevPagination.page !== newPage) {
        return {
          page: newPage,
          size: prevPagination.size,
        };
      }
      return prevPagination;
    });
  }, [searchParams]);

  // Query: Fetch Time Logs (Unreported)
  const {
    data: timelogList,
    isFetching: timelogListLoading,
    refetch: timelogListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchTimelogs", pages, limit, formattedDate, sort],
    queryFn: () => GetTimelogListUnreported({ page: pages, limit, formattedDate, sort }, session),
    enabled: activeTab === "unreported",
  });

  // Query: Fetch Time Logs (Reported)
  const {
    data: reportedList,
    isFetching: reportedListLoading,
    refetch: reportedListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchReportedTimelogs", pages, limit, formattedStartDate, formattedEndDate, sort],
    queryFn: () =>
      GetTimelogListReported(
        {
          page: pages,
          limit,
          startDate: formattedStartDate || format(new Date(), "yyyy-MM-dd"),
          endDate: formattedEndDate || format(addDays(new Date(), 7), "yyyy-MM-dd"),
          sort,
        },
        session,
      ),
    enabled: activeTab === "reported" && !!formattedStartDate && !!formattedEndDate,
  });

  // Setup for pagination handling
  const totalCountAndLimit = {
    totalCount: activeTab === "unreported" ? (timelogList?.paginationMetadata?.totalCount ?? 0) : (reportedList?.paginationMetadata?.totalCount ?? 0),
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full ">
      <PageTitle title="Time Log • Ops4 Team" />

      <div className="w-full pl-4 pr-[14px] pt-8 lg:pt-8">
        {/* Header for small screens */}
        <div className="flex items-center justify-between pb-4 md:hidden">
          <span className="pl-1 md:hidden">
            <SidebarTrigger />
          </span>
          <AvatarMenu />
        </div>

        {/* Breadcrumb & Avatar */}
        <div className="flex items-center justify-between">
          <GlobalBreadCrumb initialData="Time Log" initalLink="/timelog" />
          <span className="hidden pr-2 md:flex">
            <AvatarMenu />
          </span>
        </div>

        {/* Page Heading */}
        <PageHeading title="Time Log" className="pl-2 pt-1" />

        {/* Filters & Controls */}
        <div className="mb-3 flex flex-col items-start justify-between overflow-x-hidden md:mb-0 lg:flex-row lg:items-center">
          <div className="item-start flex w-full flex-col md:flex-row md:items-end md:gap-x-4 md:gap-y-0 lg:ml-2">
            <div className="flex justify-center gap-4 my-4 md:mb-6 md:mt-4">
              {/* Tabs: Unreported / Reported */}
              <Tabs
                value={activeTab} // Make it controlled by state
                className="bg-[#F1F5F9] rounded-md text-[#64748B] w-full"
                onValueChange={(value) => {
                  // Reset selections when switching tabs
                  setSelectedIds([]);
                  // Update the active tab
                  setActiveTab(value as "unreported" | "reported");

                  // Update URL when tab changes
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("tab", value);
                  params.set("page", "1"); // Reset to page 1 when changing tabs
                  router.replace(`${pathname}?${params.toString()}`);
                }}
              >
                <TabsList className="bg-transparent flex">
                  <TabsTrigger
                    value="unreported"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm w-full"
                  >
                    Unreported
                  </TabsTrigger>
                  <TabsTrigger
                    value="reported"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm w-full"
                  >
                    Reported
                  </TabsTrigger>
                </TabsList>
              </Tabs>

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
          </div>

          {/* Date Picker & Create Log Button */}
          <div className="md:flex md:items-center md:gap-x-4 md:justify-center">
            {selectedIds.length > 0 ? (
              <AddReportedModal
                date={formattedDate}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onClose={() => setSelectedIds([])} // Clear selected IDs instead of using setAnySelected
                activeTab={activeTab}
              />
            ) : (
              <>
                {/* Date Picker */}
                {activeTab === "unreported" ? (
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
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("flex items-center gap-2 justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                      >
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            "Pick a date range"
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      {/* Date range picker (reported tab) */}
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        disabled={{ after: new Date() }} // Add this line to disable future dates
                        onSelect={(range) => {
                          if (range) {
                            setDateRange(range);
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
                        className="[&_.rdp-day_selected]:!bg-[#0F172A] [&_.rdp-day_in_range]:!bg-[#F1F5F9] [&_.rdp-day_in_range]:!rounded-none [&_.rdp-day_selected]:!rounded-md [&_.rdp-day_selected:first-child]:!rounded-l-md [&_.rdp-day_selected:last-child]:!rounded-r-md"
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Create Log Button (Only show in unreported view) */}
                {activeTab === "unreported" && <CreateLogModal date={date} />}
              </>
            )}
          </div>
        </div>

        {/* Table or Empty States */}
        <div className="mt-6 lg:ml-2 lg:mt-0">
          {activeTab === "unreported" ? (
            timelogListLoading ? (
              <EmptyTableSkeleton />
            ) : timelogList?.data?.length === 0 ? (
              <EmptyTimelogView />
            ) : (
              <TimelogTable
                totalCountAndLimit={totalCountAndLimit}
                projects={timelogList?.data ?? []}
                loading={timelogListLoading}
                refetch={timelogListRefetch}
                currentPage={pages}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            )
          ) : reportedListLoading ? (
            <EmptyTableSkeleton />
          ) : reportedList?.data?.length === 0 ? (
            <EmptyTimelogView />
          ) : (
            <TimelogReportedListTable
              totalCountAndLimit={totalCountAndLimit}
              projects={reportedList?.data ?? []}
              loading={reportedListLoading}
              refetch={reportedListRefetch}
              currentPage={pages}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelogPage;
