"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { CircleAlert, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ButtonComponent";
import AvatarMenu from "@/components/AvatarMenu";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import { CustomTable } from "@/components/ui/customTable/CustomTable";
import { CustomPagination } from "@/components/ui/customTable/CustomPagination";
import EmptyMemberListView from "./emptyMemberlistView";
import Searchbar from "../../projects/_components/searchbar";
import { GetMemberList } from "../../../../../helpers/feedback/feedbackApi";

const SendFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const session = useSession();

  // UI States
  const [searchText, setSearchText] = useState("");

  // Pagination handling
  let currentPage = parseInt(searchParams.get("page") || "1");
  let page = searchText ? "1" : currentPage.toString();
  const limit = "10";

  // Data fetching
  const {
    data: memberList,
    isFetching: memberListLoading,
    refetch: memberListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchMembers", page, limit, searchText],
    queryFn: () => GetMemberList(session, page, limit, searchText),
  });

  // Handle search submission
  const handleSearch = (value: string) => {
    setSearchText(value);

    // Update URL to reflect page change
    // const params = new URLSearchParams(searchParams.toString());
    // params.set("page", "1");
    // router.replace(`${pathname}?${params.toString()}`);
  };

  // Table columns definition
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: () => <div>Members</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 w-full">
          {row.original?.avatarUrls ? (
            <Image src={row.original?.avatarUrls} alt={row.original.name} width={40} height={40} className="w-8 h-8 rounded-full" />
          ) : null}
          <span className="font-semibold text-sm line-clamp-none break-words">{row.original.displayName}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="">Email</div>,
      cell: ({ row }) => <div className="">{row.original?.emailAddress}</div>,
    },
    {
      accessorKey: "designation",
      header: () => <div className="">Designation</div>,
      cell: ({ row }) => <div className="">{row.original?.designation}</div>,
    },
    {
      accessorKey: "action",
      header: () => <div className="text-bold">Action</div>,
      cell: ({ row }: { row: any }) => (
        <Link href={`/feedback/send-feedback/${row.original._id}`}>
          <div className="text-medium flex items-center">
            <Button className="hidden md:inline-flex" variant="outline">
              Send Feedback
            </Button>
            <Button className="md:hidden" variant="outline">
              <SendHorizonal />
            </Button>
          </div>
        </Link>
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
          <GlobalBreadCrumb initialData="Feedback" initalLink="/feedback" secondayData="Send Feedback" />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>
        <PageHeading title="Send Feedback" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-end w-full lg:ml-2">
            {/* Search Bar */}
            <Searchbar
              placeholder="Search by name or email"
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
            {/* <Link href={`/feedback/send-feedback`}>
              <Button variant="defaultEx">
                <span className="text-nowrap flex items-center gap-x-[6px]">Send Feedback</span>
              </Button>
            </Link> */}
          </div>
        </div>

        <div className="mt-6 lg:mt-0 lg:ml-2">
          {memberListLoading ? (
            <EmptyTableSkeleton /> // Show loader while data is being fetched
          ) : memberList?.data?.length === 0 ? (
            <EmptyMemberListView />
          ) : (
            <div className="flex flex-col gap-4">
              <CustomTable columns={columns} data={memberList?.data || []} />

              <CustomPagination page={currentPage} pageSize={10} totalCount={memberList?.paginationMetadata?.totalCount || 0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendFeedbackPage;
