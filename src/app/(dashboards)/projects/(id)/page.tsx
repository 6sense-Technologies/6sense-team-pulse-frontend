"use client";
import { Button } from "@/components/ButtonComponent";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import Searchbar from "../_components/searchbar";
import { ProjectDropdown } from "../_components/projectDropdown";
import { ProjectTable } from "../_components/projectTable";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useQuery } from "@tanstack/react-query";
import { GetProjectList } from "../../../../../helpers/projects/projectApi";
import { useSearchParams } from "next/navigation";
import { FolderPlus } from "lucide-react";
import Link from "next/link";
import EmptyTableSkeleton from "@/components/emptyTableSkeleton";
import EmptyProjectView from "@/components/emptyProjectView";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import AvatarMenu from "@/components/AvatarMenu";

const ProjectList = () => {
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const session = useSession();
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
    queryFn: () => GetProjectList({ page: pages, limit },session),
  });

  console.log(projectList);

  const totalCountAndLimit = {
    totalCount: projectList?.total ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="w-full">
      <PageTitle title="Projects • Ops4 Team" />

      <div className="pl-4 pt-8 lg:pt-8 pr-[14px] w-full">
      <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1 "><SidebarTrigger /></span>
          <AvatarMenu />
        </div>
        <div className="flex justify-between items-center">
        <GlobalBreadCrumb
          initialData="Projects"
          initalLink="/projects"
        />
        <span className="hidden md:flex pr-2">
          <AvatarMenu />
          </span>
        </div>
        <PageHeading
          title="Projects"
          className="pl-2 pt-1"
        />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:mb-0 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:gap-x-4 md:gap-y-0 item-start md:items-end w-full lg:ml-2">
            <Searchbar
              placeholder="Search by project name"
              name="search"
              btntext="Search"
              className="mt-6 lg:mt-[18px] mb-[26px] gap-x-2 w-full md:max-w-[291px] relative"
              variant="light"
            />
            <ProjectDropdown
              placeholder="Filter by Tool"
              name="tool"
              active={false}
              className="mb-[26px]"
            />
          </div>
          <div className="w-full md:w-auto">
            <Link href={`/projects/create`}>
              <Button variant="defaultEx">
                <span className="text-nowrap flex items-center gap-x-[6px]">
                  <FolderPlus size={16} className="mr-1" />
                  Create Project
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6 lg:mt-0 lg:ml-2">
          {projectListLoading ? (
            <EmptyTableSkeleton /> // Show loader while data is being fetched
          ) : projectList?.data?.length === 0 ? (
            <EmptyProjectView />
          ) : (
            // Render the project table when there is data
            <ProjectTable
              totalCountAndLimit={totalCountAndLimit}
              projects={projectList?.data ?? []}
              loading={projectListLoading}
              refetch={projectListRefetch}
              currentPage={pages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;