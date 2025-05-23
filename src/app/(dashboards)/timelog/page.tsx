"use client";

import AvatarMenu from "@/components/AvatarMenu";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProjectDropdown } from "../projects/_components/projectDropdown";
import Link from "next/link";
import { Button } from "@/components/ButtonComponent";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronDown, ChevronUp, FolderPlus, ListFilter } from "lucide-react";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import EmptyProjectView from "@/components/emptyProjectView";
import { GetTimelogList } from "../../../../helpers/timelogs/timelogApi";
import { TimelogTable } from "./_components/timelogTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmptyTimelogView from "./_components/emptyTimelogView";

const TimelogPage = () => {
  const [date, setDate] = React.useState<Date>(new Date());
  // console.log("date", date);
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  console.log("formattedDate", formattedDate);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const session = useSession();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const searchParams = useSearchParams();

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

  const {
    data: timelogList,
    isFetching: timelogListLoading,
    refetch: timelogListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchTimelogs", pages, limit, formattedDate, sort], // include sort in queryKey
    queryFn: () => GetTimelogList({ page: pages, limit, formattedDate, sort }, session),
  });

  console.log("timelogList", timelogList);

  const totalCountAndLimit = {
    totalCount: timelogList?.paginationMetadata?.totalCount ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
      <PageTitle title="Time Log • Ops4 Team" />

      <div className="w-full pl-4 pr-[14px] pt-8 lg:pt-8">
        <div className="flex items-center justify-between pb-4 md:hidden">
          <span className="pl-1 md:hidden">
            <SidebarTrigger />
          </span>
          <AvatarMenu />
        </div>
        <div className="flex items-center justify-between">
          <GlobalBreadCrumb initialData="Time Log" initalLink="/timelog" />
          <span className="hidden pr-2 md:flex">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading title="Time Log" className="pl-2 pt-1" />

        <div className="mb-3 flex flex-col items-start justify-between overflow-x-hidden md:mb-0 lg:flex-row lg:items-center">
          <div className="item-start flex w-full flex-col md:flex-row md:items-end md:gap-x-4 md:gap-y-0 lg:ml-2">
            <div className="flex justify-center gap-4 my-4 md:mb-6 md:mt-4">
              <Tabs defaultValue="account" className="bg-[#F1F5F9] rounded-md text-[#64748B] w-full">
                <TabsList className="bg-transparent flex">
                  <TabsTrigger
                    value="account"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm w-full"
                  >
                    Unreported
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm w-full"
                  >
                    Reported
                  </TabsTrigger>
                </TabsList>
                {/* <TabsContent value="account">Make changes to your account here.</TabsContent> */}
                {/* <TabsContent value="password">Change your password here.</TabsContent> */}
              </Tabs>

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

          <div className="md:flex md:items-center md:gap-x-4 md:justify-center">
            {/* date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "flex items-center gap-2 justify-start text-left font-normal", // add items-center and gap-2
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{date ? format(date, "PPP") : "Pick a date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Link href={`/timelog/create`}>
              <Button className="mt-4 md:mt-0" variant="defaultEx" disabled>
                <span className="flex items-center gap-x-[6px] text-nowrap">Create Log</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6 lg:ml-2 lg:mt-0">
          {timelogListLoading ? (
            <EmptyTableSkeleton /> // Show loader while data is being fetched
          ) : timelogList?.data?.length === 0 ? (
            <EmptyTimelogView />
          ) : (
            // Render the project table when there is data
            <TimelogTable
              totalCountAndLimit={totalCountAndLimit}
              projects={timelogList?.data ?? []}
              loading={timelogListLoading}
              refetch={timelogListRefetch}
              currentPage={pages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelogPage;
