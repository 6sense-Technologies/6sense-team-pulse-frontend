"use client";
import EmptyTableDataView from "@/app/components/UI/EmptyTableDataView";
import IconComponent from "@/app/components/UI/IconComponent";
import MemberDetail from "@/app/components/UI/MemberDetail";
import MenuComponent from "@/app/components/UI/MenuComponent";
import PageTitle from "@/app/components/UI/PageTitle";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { IMemberInformationType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MemberInformation = (): JSX.Element => {
    const { accountId } = useParams();

    const searchParams = useSearchParams();
    const [pagination, setPaignation] = useState({
        page: 1,
        size: 30,
    })

    // useEffect(() => {
    //     setPaignation({ page: searchParams.get("page") ? Number(searchParams.get("page")) : 1, size: pagination.size })
    // }, [searchParams, pagination.size])

    useEffect(() => {
        const newPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

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


    const { data, isFetching: memberLoading, refetch: memberInformationRefetch } = useQuery<IMemberInformationType>({
        queryKey: ["fetchMemberInformation", accountId, pagination.page, pagination.size],
        queryFn: async () => {
            const res: AxiosResponse<IMemberInformationType> = await axios.get(`${BACKEND_URI}/users/${accountId}?page=${pagination?.page}&limit=${pagination?.size}`);

            return res.data;
        },
        refetchOnWindowFocus: false,
        enabled: !!accountId && !!pagination.page && !!pagination.size
    });

    const member = data?.user ?? undefined;
    const totalCount = data?.user?.totalIssueHistory;
    const totalCountAndLimit = { totalCount: totalCount ?? 0, size: pagination.size ?? 10 }

    return (
        <div className='relative adjustedWidthForMenu px-4 md:left-[280px]'>
            <MenuComponent currentPage={'members'} />
            <PageTitle pageName='Members' title='6sense Efficiency' />
            <section className="mt-[18px]">
                <div className='mb-2 flex items-center gap-x-2 mr-auto text-base font-medium'>
                    <Link href={'/member-list?page=1'} className='text-subHeading'>Members</Link>
                    <IconComponent name={'CaretRight'} color={COLOR_SUBHEADING} fontSize={14} />
                    <Link href={`/member-list/${accountId}?page=1`} className='text-primary'>Information</Link>
                </div>
                {/* <div className='mr-auto text-base text-primary font-medium'>Information</div> */}
                <h3 className='text-headingXS md:text-headingBase font-semibold'>Member Information</h3>
            </section>
            <section className="mt-4 relative">
                {
                    memberLoading ?
                        <div className="flex justify-center items-center min-h-[75vh]">
                            <IconComponent data-testid="loader" name={'loader'} color={'#BA8D46'} className='animate-spin' fontSize={40} />
                        </div>
                        :
                        <>
                            {member?.issueHistory && member?.issueHistory?.length > 0 ?
                                <MemberDetail onUpdate={() => { return memberInformationRefetch() }} totalCountAndLimit={totalCountAndLimit} data={member} />
                                : <EmptyTableDataView iconName="FolderPlus" heading='No information' subHeading="" />
                            }
                        </>
                }
            </section>
        </div>
    )
}

export default MemberInformation