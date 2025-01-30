"use client";
import { Button } from "@/components/ButtonComponent";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageHeading from "@/components/pageHeading";
import { useSearchParams } from "next/navigation";
import { FolderPlus } from "lucide-react";
import Link from "next/link";
import { TeamDropdown } from "./_components/teamDropdown";
import TeamSearchbar from "./_components/teamSearchbar";
import { TeamTable } from "./_components/teamTable";

const TeamListPage: React.FC = () => {
  const TeamList = [
    {
      teamMember: {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      role: "Developer",
      designation: "Frontend Developer",
      email: "john.doe@example.com",
      performance: "85%",
    },
    {
      teamMember: {
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      role: "Developer",
      designation: "Backend Developer",
      email: "jane.smith@example.com",
      performance: "90%",
    },
    {
      teamMember: {
        name: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      role: "Designer",
      designation: "UI/UX Designer",
      email: "alice.johnson@example.com",
      performance: "88%",
    },
    {
      teamMember: {
        name: "Bob Brown",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      role: "Manager",
      designation: "Project Manager",
      email: "bob.brown@example.com",
      performance: "92%",
    },
    {
      teamMember: {
        name: "Charlie Davis",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      role: "Tester",
      designation: "QA Engineer",
      email: "charlie.davis@example.com",
      performance: "87%",
    },
    {
      teamMember: {
        name: "Emily Evans",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      role: "Developer",
      designation: "Full Stack Developer",
      email: "emily.evans@example.com",
      performance: "89%",
    },
    {
      teamMember: {
        name: "Frank Green",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      role: "Designer",
      designation: "Graphic Designer",
      email: "frank.green@example.com",
      performance: "84%",
    },
    {
      teamMember: {
        name: "Grace Harris",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      role: "Developer",
      designation: "Mobile Developer",
      email: "grace.harris@example.com",
      performance: "91%",
    },
    {
      teamMember: {
        name: "Henry King",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      role: "Tester",
      designation: "Automation Engineer",
      email: "henry.king@example.com",
      performance: "86%",
    },
    {
      teamMember: {
        name: "Irene Lee",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      role: "Manager",
      designation: "Product Manager",
      email: "irene.lee@example.com",
      performance: "93%",
    },
  ];

  const [pages, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

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

  const totalCountAndLimit = {
    totalCount: TeamList.length,
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
          secondayLink="/team-efficiency"
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
            teamMembers={TeamList}
            currentPage={pages}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamListPage;