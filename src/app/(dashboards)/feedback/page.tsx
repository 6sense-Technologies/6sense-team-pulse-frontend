"use client";

import AvatarMenu from "@/components/AvatarMenu";
import { Button } from "@/components/ButtonComponent";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { CustomPagination } from "@/components/ui/customTable/CustomPagination";
import { CustomTable } from "@/components/ui/customTable/CustomTable";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, CircleUser, ListFilter, Check, CircleDot, Dot, Circle, CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetFeedbackList } from "../../../../helpers/feedback/feedbackApi";
import Searchbar from "../projects/_components/searchbar";
import EmptyFeedbackListView from "./_components/EmptyFeedbackListView";
import ViewFeedbackModal from "./_components/ViewFeedbackModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format, subDays } from "date-fns";

const FeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const session = useSession();

  // Get search text from URL on initial load
  const urlSearchText = searchParams.get("search") || "";

  // UI States - initialize from URL
  const [searchText, setSearchText] = useState(urlSearchText);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7), // 7 days ago
    to: new Date(), // Today
  });
  const formattedStartDate = dateRange?.from ? dateRange.from.toISOString() : "";
  const formattedEndDate = dateRange?.to ? dateRange.to.toISOString() : "";

  const [sortOpen, setSortOpen] = useState(false);
  // Add these state variables to your component
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const filterParam = searchParams.get("filter");
    return filterParam ? filterParam.split(",") : [];
  });
  const [sortOrder, setSortOrder] = useState<string>(() => {
    const sortParam = searchParams.get("sort");
    return sortParam || "latest";
  });

  // Pagination handling
  let currentPage = parseInt(searchParams.get("page") || "1");
  let page = currentPage.toString();
  const limit = "10";

  // 2. Update effect to preserve search text in URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let shouldUpdateUrl = false;

    // Update search parameter
    if (searchText !== params.get("search")) {
      shouldUpdateUrl = true;
      if (searchText) {
        params.set("search", searchText);
        params.set("page", "1"); // Reset to page 1 on new search
      } else {
        params.delete("search");
      }
    }

    // Update selected types in URL
    const currentFilter = params.get("filter");
    const newFilter = selectedTypes.length > 0 ? selectedTypes.join(",") : "";
    if (currentFilter !== newFilter) {
      shouldUpdateUrl = true;
      if (selectedTypes.length > 0) {
        params.set("filter", newFilter);
      } else {
        params.delete("filter");
      }
    }

    // Update sort order in URL
    if (sortOrder !== params.get("sort")) {
      shouldUpdateUrl = true;
      if (sortOrder) {
        params.set("sort", sortOrder);
      } else {
        params.delete("sort");
      }
    }

    // Add date range parameters to URL
    const currentStartDate = params.get("startDate");
    const currentEndDate = params.get("endDate");

    if (formattedStartDate !== currentStartDate || formattedEndDate !== currentEndDate) {
      shouldUpdateUrl = true;
      if (formattedStartDate) {
        params.set("startDate", formattedStartDate);
      } else {
        params.delete("startDate");
      }
      if (formattedEndDate) {
        params.set("endDate", formattedEndDate);
      } else {
        params.delete("endDate");
      }
    }

    // Apply all URL updates in a single router.push
    if (shouldUpdateUrl) {
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [searchText, searchParams, pathname, router, selectedTypes, sortOrder, formattedStartDate, formattedEndDate]);

  // Data fetching
  const {
    data: feedbackList,
    isFetching: feedbackListLoading,
    refetch: feedbackListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchFeedback", page, limit, searchText, selectedTypes, sortOrder, formattedStartDate, formattedEndDate],
    queryFn: () => GetFeedbackList(session, page, limit, searchText, selectedTypes, sortOrder, formattedStartDate, formattedEndDate),
  });
  // console.log("🚀 ~ FeedbackPage ~ feedbackList:", feedbackList);

  // 3. Update search handler
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Table columns definition
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "createdAt",
      header: () => <div className="">Date</div>,
      cell: ({ row }) => (
        <div className="">
          {row.original?.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: () => <div>Name</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 w-full">
          {row.original?.assignedTo?.avatarUrls ? (
            <Image
              src={row.original?.assignedTo?.avatarUrls}
              alt={row.original?.assignedTo?.displayName}
              width={40}
              height={40}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <CircleUser className="w-10 h-10 text-muted-foreground" />
          )}
          <div>
            <h1 className="font-semibold text-sm line-clamp-none break-words">{row.original?.assignedTo?.displayName}</h1>
            <p className="text-sm text-muted-foreground">{row.original?.assignedTo?.designation}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: () => <div className="">Comment</div>,
      cell: ({ row }) => {
        const value = row.original?.comment || "";
        const displayValue = value.length > 50 ? `${value.slice(0, 50)}...` : value;
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn("w-1.5 h-1.5 rounded-full", {
                "bg-[#15803D]": row.original?.tone === "Positive", // Positive
                "bg-[#6B7280]": row.original?.tone === "Neutral", // Negative
                "bg-[#B91C1C]": row.original?.tone === "Negative", // Neutral
              })}
            ></div>
            {displayValue || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => <div className="">Type</div>,
      cell: ({ row }) => (
        <div className="">
          <span className="border rounded-full py-1.5 px-3">{row.original?.type}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-bold">Action</div>,
      cell: ({ row }: { row: any }) => (
        <div className="text-medium flex items-center">
          <ViewFeedbackModal feedbackId={row.original?._id} />
        </div>
      ),
      size: 20,
    },
  ];

  // Add this handler to toggle type selection
  const toggleTypeSelection = (type: string) => {
    setSelectedTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));
  };

  // Add this handler for sort selection
  const handleSortSelection = (sort: string) => {
    setSortOrder(sort);
  };

  return (
    <div className="w-full">
      <PageTitle title="Projects • Ops4 Team" />

      <div className="pl-4 pt-8 lg:pt-8 pr-[14px] w-full">
        <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1">
            <SidebarTrigger />
          </span>
          <AvatarMenu />
        </div>
        <div className="flex justify-between items-center">
          <GlobalBreadCrumb initialData="Feedback" initalLink="/feedback" />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading title="All Feedbacks" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-end w-full lg:ml-2 items-center mb-6">
            {/* Search Bar */}
            <Searchbar
              placeholder="Search by name, comments"
              name="search"
              btntext="Search"
              className="mt-6 lg:mt-[18px] gap-x-2 w-full md:max-w-[291px] relative"
              variant="light"
              disabled={false}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={handleSearch}
            />

            {/* Sort/Filter Dropdown */}
            <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
              <DropdownMenuTrigger className={cn(" focus:outline-0")}>
                <div className="hidden md:flex items-center gap-1">
                  Filter {selectedTypes.length > 0 && <span>by Type</span>} {sortOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
                <div className="md:hidden">
                  <ListFilter />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-56">
                {/* Type Filter */}
                <DropdownMenuLabel className="font-semibold text-sm">Type</DropdownMenuLabel>
                <DropdownMenuGroup className="space-y-1 p-1">
                  {/* US, Task, Bug, Suggestions, Personal */}
                  {["Bug", "Personal", "Suggestions", "Task", "User Story"].map((type) => (
                    <DropdownMenuItem key={type} onClick={() => toggleTypeSelection(type)} className="flex items-center gap-2 p-1.5 cursor-pointer">
                      <div className="w-4 flex items-center justify-center">{selectedTypes.includes(type) && <Check className="h-4 w-4" />}</div>
                      <span>{type}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Sort by Time */}
                <DropdownMenuLabel className="font-semibold text-sm">Sort by Time</DropdownMenuLabel>
                <DropdownMenuGroup className="space-y-1 p-1">
                  {[
                    { id: "latest", label: "Latest" },
                    { id: "oldest", label: "Oldest" },
                  ].map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => handleSortSelection(option.id)}
                      className="flex items-center gap-2 p-1.5 cursor-pointer"
                    >
                      <div className="w-4 flex items-center justify-center">
                        {sortOrder === option.id && <Circle fill="black" className="w-2 h-2 " />}
                      </div>
                      <span>{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                disabled={{ after: new Date() }}
                onSelect={(range) => {
                  if (range?.from) {
                    setDateRange({
                      from: range.from,
                      to: range.to || range.from,
                    });
                  }
                  // else {
                  //   setDateRange({
                  //     from: subDays(new Date(), 7),
                  //     to: new Date(),
                  //   });
                  // }
                }}
                initialFocus
                className="[&_.rdp-day_selected]:!bg-[#0F172A] [&_.rdp-day_in_range]:!bg-[#F1F5F9] [&_.rdp-day_in_range]:!rounded-none [&_.rdp-day_selected]:!rounded-md [&_.rdp-day_selected:first-child]:!rounded-l-md [&_.rdp-day_selected:last-child]:!rounded-r-md"
              />
            </PopoverContent>
          </Popover>

          <div className="w-full md:w-auto ml-2">
            <Link href={`/feedback/send-feedback`}>
              <Button variant="defaultEx">
                <span className="text-nowrap flex items-center gap-x-[6px]">Send Feedback</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 lg:ml-2">
          {feedbackListLoading ? (
            <EmptyTableSkeleton /> // Show loader while data is being fetched
          ) : feedbackList?.data?.length === 0 ? (
            <EmptyFeedbackListView />
          ) : (
            <div className="flex flex-col gap-4">
              <CustomTable columns={columns} data={feedbackList?.data || []} />

              <CustomPagination page={currentPage} pageSize={10} totalCount={feedbackList?.paginationMetadata?.totalCount || 0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
