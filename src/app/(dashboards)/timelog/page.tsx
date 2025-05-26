"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronDown, ChevronUp, ListFilter, CalendarIcon } from "lucide-react";

import AvatarMenu from "@/components/AvatarMenu";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ButtonComponent";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import EmptyProjectView from "@/components/emptyProjectView";
import EmptyTimelogView from "./_components/emptyTimelogView";
import { ProjectDropdown } from "../projects/_components/projectDropdown";
import { TimelogTable } from "./_components/timelogTable";

import { GetTimelogList } from "../../../../helpers/timelogs/timelogApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import AddReportedModal from "./_components/addReportedModal";

const TimelogPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  console.log("🚀 ~frompage TimelogPage ~ selectedIds:", selectedIds);
  const session = useSession();

  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [anySelected, setAnySelected] = useState(false);

  const searchParams = useSearchParams();
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

  // Query: Fetch Time Logs
  const {
    data: timelogList,
    isFetching: timelogListLoading,
    refetch: timelogListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchTimelogs", pages, limit, formattedDate, sort],
    queryFn: () => GetTimelogList({ page: pages, limit, formattedDate, sort }, session),
  });

  // Setup for pagination handling
  const totalCountAndLimit = {
    totalCount: timelogList?.paginationMetadata?.totalCount ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
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
            {anySelected ? (
              <AddReportedModal date={formattedDate} selectedIds={selectedIds} />
            ) : (
              <>
                {/* Date Picker */}
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
                    <Calendar
                      mode="single"
                      selected={date}
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
                    />
                  </PopoverContent>
                </Popover>

                {/* Create Log Button (Disabled) */}
                <Link href={``}>
                  <Button className="mt-4 md:mt-0" variant="defaultEx" disabled>
                    <span className="flex items-center gap-x-[6px] text-nowrap">Create Log</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Table or Empty States */}
        <div className="mt-6 lg:ml-2 lg:mt-0">
          {timelogListLoading ? (
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
              onSelectionChange={setAnySelected}
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
