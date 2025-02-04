"use client";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useSearchParams } from "next/navigation";
import { TeamDropdown } from "./_components/teamDropdown";
import TeamSearchbar from "./_components/teamSearchbar";
import { TeamTable } from "./_components/teamTable";
import { useQuery } from "@tanstack/react-query";
import { GetTeamList } from "../../../../api/Team/teamApi";
import { TeamList } from "@/types/Team.types";

const TeamListPage: React.FC = () => {

  const [pages, setPages] = useState<number>(1);
  const [limit] = useState<number>(10);

  interface Pagination {
    page: number;
    size: number;
  }

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const newPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

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
    data: teamList,
    isFetching: teamListLoading,
    refetch: teamListRefetch,
  } = useQuery<TeamList>({
    queryKey: ["teamList", pages, limit],
    queryFn: () => GetTeamList({ page: pages, limit }),
  });

  console.log("Team",teamList);

  const totalCountAndLimit = {
    totalCount: teamList?.count ?? 0,
    size: pagination.size ?? 10,
  };


  return (
    <div className="w-full">
      <PageTitle title="Team Efficiency • Ops4 Team" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
        <GlobalBreadCrumb
          initialData="Home"
          initalLink="/"
          secondayData="Team"
          secondayLink="/team"
        />
        <PageHeading title="Team" className="pl-2 pt-3" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-0">
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-end w-full">
            <TeamSearchbar
              placeholder="Search by name, email"
              name="search"
              btntext="Search"
              className="mt-[18px] mb-[26px] gap-x-2 w-full max-w-[291px] relative"
              variant="light"
            />
            <TeamDropdown
              placeholder="Filter by Role"
              name="tool"
              active={false}
              className="mb-[26px] max-w-[143px] !placeholder:text-black"
            />
              <TeamDropdown
              placeholder="Filter by Designation"
              name="tool"
              active={false}
              className="mb-[26px] !placeholder:text-black"
            /> 
          </div>
        </div>
        <div className="">
          <TeamTable
            totalCountAndLimit={totalCountAndLimit}
            loading={teamListLoading}
            refetch={teamListRefetch}
            teamMembers={teamList?.data}
            currentPage={pages}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamListPage;