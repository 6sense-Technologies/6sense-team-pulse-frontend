"use client";

import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { BACKEND_URI, TEMP_BACKEND_URI } from "@/app/utils/constants/constants";
import IconComponent from "@/components/IconComponent";
import MemberDetail from "@/components/MemberDetail";
import PageHeading from "@/components/pageHeading";
import PageTitle from "@/components/PageTitle";
import { IMemberInfo } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MemberInformation = (): JSX.Element => {
    const { accountId } = useParams();
    const searchParams = useSearchParams();
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
    });

    console.log("Account ID:",accountId);

    useEffect(() => {
        const newPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

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

    const { data:memberInformation, isFetching: memberLoading, refetch: memberInformationRefetch } = useQuery<IMemberInfo>({

        queryKey: ["fetchMemberInformation", accountId, pagination.page, pagination.size],
        queryFn: async () => {
            const res: AxiosResponse<IMemberInfo> = await axios.get(`${TEMP_BACKEND_URI}/users/v2?userId=${accountId}&page=${pagination?.page}&limit=${pagination?.size}`);
            
            console.log(res.data);

            return res.data;
        },
        refetchOnWindowFocus: false,
        enabled: !!accountId && !!pagination.page && !!pagination.size
    });

    console.log("🚀 ~ memberInformation:", memberInformation)

    
    const totalCount = memberInformation?.history?.count;
    const totalCountAndLimit = { totalCount: totalCount ?? 0, size: pagination.size ?? 10 };
    console.log("🚀 ~ totalCount:", totalCount)

    return (
        <div className='relative adjustedWidthForMenu px-4'>
            {/* <MenuComponent currentPage={'members'} /> */}
            <PageTitle pageName='Members' title='6sense Efficiency' />
            <section className="mt-[18px]">
                <div className='mb-2 flex items-center gap-x-2 mr-auto text-base font-medium'>
                    <Link href={'/member-list?page=1'} className='text-subHeading'>Members</Link>
                    <IconComponent name={'CaretRight'} color={COLOR_SUBHEADING} fontSize={14} />
                    <Link href={`/member-list/${accountId}?${searchParams.toString()}`} className='text-primary'>Information</Link>
                </div>
                {/* <div className='mr-auto text-base text-primary font-medium'>Information</div> */}
                <PageHeading title='Member Information' subTitle="" />
            </section>
            <section className="mt-4 relative">
                {
                    memberLoading ? (
                        <div className="flex justify-center items-center min-h-[75vh]">
                            <IconComponent data-testid="loader" name={'loader'} color={'#BA8D46'} className='animate-spin' fontSize={40} />
                        </div>
                    ) : (
                        <>
                            <MemberDetail onUpdate={() => { return memberInformationRefetch() }} totalCountAndLimit={totalCountAndLimit} memberInformation={ memberInformation} />
                            {/* {member?.issueHistory && member?.issueHistory?.length > 0 ?
                                <MemberDetail onUpdate={() => { return memberInformationRefetch() }} totalCountAndLimit={totalCountAndLimit} data={member} />
                                : <EmptyTableDataView iconName="FolderPlus" heading='No information' subHeading="" />
                            } */}
                        </>
                    )
                }
            </section>
        </div>
    );
};

export default MemberInformation;