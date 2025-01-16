"use client";
import IconComponent from "@/app/components/UI/IconComponent";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import PageHeading from "@/components/pageHeading";
import {TGrowthItem } from "@/types/types";
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

  const id = localStorage.getItem("memberId")



  useEffect(() => {
      setPaignation({ page: searchParams.get("page") ? Number(searchParams.get("page")) : 1, size: pagination.size })
  }, [searchParams, pagination.size])

  const {
    data : growthItems,
    isFetching: growthLoading,
    refetch: growthRefetch,
  } = useQuery<TGrowthItem>({
    queryKey: ["fetchGrowth", pagination],
    queryFn: async () => {
      const res: AxiosResponse<TGrowthItem> = await axios.get(
        `${TEMP_BACKEND_URI}/goals/?page=${pagination.page}&limit=${pagination.size}`
      );

      console.log(res.data);

      return res.data;
      
    },
    refetchOnWindowFocus: false,
  });

  console.log(growthItems);

  const totalCount = growthItems?.length;
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
            growthItems={growthItems ?? []}
            refetch={growthRefetch}
            />
        </div>
      </section>
    </div>
  );
};

export default MemberGrowth;
