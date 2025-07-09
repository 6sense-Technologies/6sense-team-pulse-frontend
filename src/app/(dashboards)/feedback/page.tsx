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
import { CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetFeedbackList } from "../../../../helpers/feedback/feedbackApi";
import Searchbar from "../projects/_components/searchbar";
import EmptyFeedbackListView from "./_components/EmptyFeedbackListView";
import ViewFeedbackModal from "./_components/ViewFeedbackModal";

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

  // Pagination handling
  let currentPage = parseInt(searchParams.get("page") || "1");
  let page = currentPage.toString();
  const limit = "10";

  // 2. Update effect to preserve search text in URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Only update URL if searchText has changed
    if (searchText !== params.get("search")) {
      if (searchText) {
        params.set("search", searchText);
        params.set("page", "1"); // Reset to page 1 on new search
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [searchText, searchParams, pathname, router]);

  // Data fetching
  const {
    data: feedbackList,
    isFetching: feedbackListLoading,
    refetch: feedbackListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchFeedback", page, limit, searchText],
    queryFn: () => GetFeedbackList(session, page, limit, searchText),
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
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-end w-full lg:ml-2">
            {/* Search Bar */}
            <Searchbar
              placeholder="Search by name, comments"
              name="search"
              btntext="Search"
              className="mt-6 lg:mt-[18px] mb-[26px] gap-x-2 w-full md:max-w-[291px] relative"
              variant="light"
              disabled={false}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={handleSearch}
            />
            {/* <ProjectDropdown placeholder="Filter by Tool" name="tool" active={false} className="mb-[26px]" /> */}
          </div>
          <div className="w-full md:w-auto">
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
