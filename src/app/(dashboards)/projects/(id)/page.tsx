"use client";
import { Button } from "@/components/ButtonComponent";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import Searchbar from "../_components/searchbar";
import { Dropdown } from "@/components/dropdown";
import { ProjectTable } from "../_components/projectTable";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useQuery } from "@tanstack/react-query";
import { GetProjectList } from "../../../../../api/projects/projectApi";
import { useSearchParams } from "next/navigation";

const ProjectList = () => {
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({
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
    data: projectList,
    isFetching: projectListLoading,
    refetch: projectListRefetch,
  } = useQuery<any>({
    queryKey: ["fetchProjects", pages, limit],
    queryFn: () => GetProjectList({ page: pages, limit }),
  });

  console.log(projectList);

  const totalCountAndLimit = {
    totalCount: projectList?.total ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
      <PageTitle pageName="Ops4 Team" title="Projects" />

      <div className="pl-4 pt-8 pr-[14px] w-full">
        <GlobalBreadCrumb
          initialData="Projects"
          initalLink="/projects"
          secondayData="List"
          secondayLink="/projects"
        />
        <PageHeading
          title="List"
          subTitle="Some examples built using the components. Use this as a guide to build your own."
          className="pl-2 pt-3"
        />
        <div className="flex flex-col md:flex-row justify-between gap-y-3 md:gap-y-0 item-start md:items-end w-full">
          <Searchbar
            placeholder="Search by project name"
            name="search"
            btntext="Search"
            className="mt-[18px] mb-[26px] gap-x-2 w-full max-w-[291px] relative"
            variant="light"
          />
          <Dropdown
            placeholder="Filter by Tool"
            name="tool"
            active={false}
            className="mb-[26px]"
          />
        </div>
        <div className="">
          <ProjectTable
            totalCountAndLimit={totalCountAndLimit}
            projects={projectList?.data ?? []}
            refetch={projectListRefetch}
            currentPage={pages}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectList;