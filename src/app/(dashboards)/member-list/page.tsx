"use client";

import { BACKEND_URI, TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import AddMemberDrawer from "@/components/AddMemberDrawer";
import { Button } from "@/components/ButtonComponent";
import EmptyTableViewSkeleton from "@/components/EmptyTableSkeleton";
import { MemberTable } from "@/components/memberTable";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { IAllMembersType} from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MemberList = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = (): void => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = (): void => {
    setIsDrawerOpen(false);
  };
  const searchParams = useSearchParams();
  const [pagination, setPaignation] = useState({
    page: 1,
    size: 10,
  });

  // useEffect(() => {
  //     setPaignation((prevPagination) => {
  //         return {
  //             page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  //             size: prevPagination.size,
  //         }
  //     });
  // }, [searchParams])

  useEffect(() => {
    const newPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    // Only update pagination if the new page is different from the current page
    setPaignation((prevPagination) => {
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
    data : members,
    isFetching: membersLoading,
    refetch: memberRefetch,
  } = useQuery<IAllMembersType>({
    queryKey: ["fetchMembers", pagination],
    queryFn: async () => {
      const res: AxiosResponse<IAllMembersType> = await axios.get(
        `${TEMP_BACKEND_URI}/users/v2/all?page=${pagination.page}&limit=${pagination.size}`
      );
      // console.log(res.data);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  console.log(members);

  const totalCount = members?.count;
  const totalCountAndLimit = {
    totalCount: totalCount ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="relative adjustedWidthForMenu px-4">
      {/* <MenuComponent currentPage={'members'} /> */}
      <PageTitle pageName="Members" title="6sense Efficiency" />
      <section className="mt-[18px]">
        <h4 className="mb-2 mr-auto text-base text-primary font-medium">
          Members
        </h4>
        <PageHeading title="All Members" subTitle=" " />
      </section>
      <section className="mt-4 relative">
        <div className="flex justify-start md:justify-end">
          <Button
            onClick={handleDrawerOpen}
            prefixIcon="PlusCircle"
            type="button"
            className="w-full md:w-[153px]"
            prefixIconClassName="plusIcon"
          >
            Add Member
          </Button>
        </div>
        <div className="mt-4">
          {membersLoading ? (
            <EmptyTableViewSkeleton />
          ) : (
            <MemberTable
              totalCountAndLimit={totalCountAndLimit}
              members={members?.data ?? []}
              refetch={memberRefetch}
            />
          )}
          {/* <MemberListView totalCountAndLimit={totalCountAndLimit} members={members} refetch={memberRefetch} */}
        </div>
      </section>

      {isDrawerOpen && (
        <div className="relative">
          <AddMemberDrawer
            isOpen={isDrawerOpen}
            onClose={handleDrawerClose}
            refetch={memberRefetch}
          />
        </div>
      )}
    </div>
  );
};

export default MemberList;
