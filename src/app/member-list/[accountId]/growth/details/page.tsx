"use client";
import IconComponent from "@/app/components/UI/IconComponent";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { ICreateMemberType, IGrowthDetailItems } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GrowthDetailsTable } from "../_components/growthDetailsTable";
import { Badge } from "@/components/ui/badge";
import GrowthDetailsPageHeading from "../_components/growthDetailsPageHeading";

const MemberGrowthDetails = (): JSX.Element => {
  const { accountId } = useParams();

  const searchParams = useSearchParams();
  const [pagination, setPaignation] = useState({
    page: 1,
    size: 30,
  });

  // Dummy data for IGrowthDetailItems
  const growthDetailItems: IGrowthDetailItems[] = [
    {
      id: "1",
      user: "User 1",
      goalItem: "XYZ",
      status: "In Progress",
      summary:
        "    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint error, quidem debitis dolorem delectus doloribus odio impedit provident numquam perspiciatis necessitatibus, id, inventore odit exercitationem quasi modi minus minima nobis.",
      date: "2023-01-01",
      activites: ["Activity 1", "Activity 2"],
    },
    {
      id: "2",
      user: "User 2",
      goalItem: "Goal 2",
      status: "Completed",
      summary: "Summary 2",
      date: "2023-01-02",
      activites: ["Activity 3", "Activity 4"],
    },
    {
      id: "3",
      user: "User 3",
      goalItem: "Goal 3",
      status: "In Progress",
      summary: "Summary 3",
      date: "2023-01-03",
      activites: ["Activity 5", "Activity 6"],
    },
    {
      id: "4",
      user: "User 4",
      goalItem: "Goal 4",
      status: "Todo",
      summary: "Summary 4",
      date: "2023-01-04",
      activites: ["Activity 7", "Activity 8"],
    },
    {
      id: "5",
      user: "User 5",
      goalItem: "Goal 5",
      status: "Completed",
      summary: "Summary 5",
      date: "2023-01-05",
      activites: ["Activity 9", "Activity 10"],
    },
  ];

  // useEffect(() => {
  //     setPaignation({ page: searchParams.get("page") ? Number(searchParams.get("page")) : 1, size: pagination.size })
  // }, [searchParams, pagination.size])

  const {
    data,
    isFetching: membersLoading,
    refetch: memberRefetch,
  } = useQuery<ICreateMemberType>({
    queryKey: ["fetchMembers", pagination],
    queryFn: async () => {
      const res: AxiosResponse<ICreateMemberType> = await axios.get(
        `${BACKEND_URI}/users?page=${pagination.page}&limit=${pagination.size}`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  //   const growthItems = data?.users ?? [];
  const totalCount = data?.totalUsers;
  const totalCountAndLimit = {
    totalCount: totalCount ?? 0,
    size: pagination.size ?? 10,
  };

  return (
    <div className="relative adjustedWidthForMenu px-4">
      {/* <MenuComponent currentPage={'members'} /> */}
      <section className="mt-[18px]">
        <div className="mb-2 flex items-center gap-x-2 mr-auto text-base font-medium">
          <Link href={"/member-list?page=1"} className="text-subHeading">
            Members
          </Link>
          <IconComponent
            name={"CaretRight"}
            color={COLOR_SUBHEADING}
            fontSize={14}
          />
          <Link
            href={`/member-list/${accountId}?page=1`}
            className="text-subheading"
          >
            Information
          </Link>
          <IconComponent
            name={"CaretRight"}
            color={COLOR_SUBHEADING}
            fontSize={14}
          />
          <Link
            href={`/member-list/${accountId}/growth`}
            className="text-subheading"
          >
            Growth
          </Link>
          <IconComponent
            name={"CaretRight"}
            color={COLOR_SUBHEADING}
            fontSize={14}
          />
          <Link
            href={`/member-list/${accountId}/growth/details`}
            className="text-primary"
          >
            Details
          </Link>
        </div>
        {/* <div className='mr-auto text-base text-primary font-medium'>Information</div> */}
        <div className="flex items-center gap-x-2">
          <GrowthDetailsPageHeading
            title={`${growthDetailItems[0].goalItem} Growth Details`}
            status={growthDetailItems[0].status}
            subTitle="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate recusandae"
          />
        </div>
      </section>
      <section className="mt-0 relative">
        <div className="w-full mt-4">
          <GrowthDetailsTable
            totalCountAndLimit={totalCountAndLimit}
            growthDetailItems={growthDetailItems}
            refetch={memberRefetch}
          />
        </div>
      </section>
    </div>
  );
};

export default MemberGrowthDetails;
