"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import IconComponent from "@/app/components/UI/IconComponent";
import MemberDetail from "@/app/components/UI/MemberDetail";
import MenuComponent from "@/app/components/UI/MenuComponent";
import PageTitle from "@/app/components/UI/PageTitle";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import PageHeading from "@/components/pageHeading";
import { ICreateMemberType, IGrowthItems, IMemberInformationType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GrowthTable } from "./_components/growthTable";

const MemberGrowth = (): JSX.Element => {
  const { accountId } = useParams();

  const searchParams = useSearchParams();
  const [pagination, setPaignation] = useState({
    page: 1,
    size: 30,
  });

  const growthItems: IGrowthItems[] = [
    { id: "1", user: "User 1", goalItem: "Goal 1", status: "Todo", createdAt: "2023-01-01", updatedAt: "2023-01-02", __v: 0 },
    { id: "2", user: "User 2", goalItem: "Goal 2", status: "In Progress", createdAt: "2023-01-03", updatedAt: "2023-01-04", __v: 0 },
    { id: "3", user: "User 3", goalItem: "Goal 3", status: "Todo", createdAt: "2023-01-05", updatedAt: "2023-01-06", __v: 0 },
    { id: "4", user: "User 4", goalItem: "Goal 4", status: "In Progree", createdAt: "2023-01-07", updatedAt: "2023-01-08", __v: 0 },
    { id: "5", user: "User 5", goalItem: "Goal 5", status: "Completed", createdAt: "2023-01-09", updatedAt: "2023-01-10", __v: 0 },
    { id: "6", user: "User 6", goalItem: "Goal 6", status: "Todo", createdAt: "2023-01-11", updatedAt: "2023-01-12", __v: 0 },
    { id: "7", user: "User 7", goalItem: "Goal 7", status: "In Progress", createdAt: "2023-01-13", updatedAt: "2023-01-14", __v: 0 },
    { id: "8", user: "User 8", goalItem: "Goal 8", status: "Completed", createdAt: "2023-01-15", updatedAt: "2023-01-16", __v: 0 },
    { id: "9", user: "User 9", goalItem: "Goal 9", status: "Todo", createdAt: "2023-01-17", updatedAt: "2023-01-18", __v: 0 },
    { id: "10", user: "User 10", goalItem: "Goal 10", status: "Completed", createdAt: "2023-01-19", updatedAt: "2023-01-20", __v: 0 },
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
            className="text-primary"
          >
            Growth
          </Link>
        </div>
        {/* <div className='mr-auto text-base text-primary font-medium'>Information</div> */}
        <PageHeading
          title="Member Growth"
          subTitle="Track and Manage Your Goals for Continuous Growth"
        />
      </section>
      <section className="mt-4 relative">
        <div className="w-full mt-4">
            <GrowthTable
            totalCountAndLimit={totalCountAndLimit}
            growthItems={growthItems}
            refetch={memberRefetch}
            />
        </div>
      </section>
    </div>
  );
};

export default MemberGrowth;
