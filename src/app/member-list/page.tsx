"use client";
import AddMemberDrawer from "@/app/components/UI/AddMemberDrawer";
import { Button } from "@/app/components/UI/ButtonComponent";
import EmptyTableViewSkeleton from "@/app/components/UI/EmptyTableSkeleton";
import MemberListView from "@/app/components/UI/MemberListView";
import MenuComponent from "@/app/components/UI/MenuComponent";
import PageTitle from "@/app/components/UI/PageTitle";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { ICreateMemberType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MemberList = (): JSX.Element => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleDrawerOpen = (): void => { setIsDrawerOpen(true) };
    const handleDrawerClose = (): void => { setIsDrawerOpen(false) };
    const searchParams = useSearchParams();
    const [pagination, setPaignation] = useState({
        page: 1,
        size: 10,
    })

    useEffect(() => {
        setPaignation({ page: searchParams.get("page") ? Number(searchParams.get("page")) : 1, size: pagination.size })
    }, [searchParams, pagination.size])

    const { data, isFetching: membersLoading, refetch: memberRefetch } = useQuery<ICreateMemberType>({
        queryKey: ["fetchMembers", pagination],
        queryFn: async () => {
            const res: AxiosResponse<ICreateMemberType> = await axios.get(`${BACKEND_URI}/users?page=${pagination.page}&limit=${pagination.size}`);
            return res.data;
        },
        refetchOnWindowFocus: false
    });

    const members = data?.users ?? [];
    const totalCount = data?.totalUsers;
    const totalCountAndLimit = { totalCount: totalCount ?? 0, size: pagination.size ?? 10 }

    return (
        <div className='relative adjustedWidthForMenu px-6 md:left-[280px]'>
            <MenuComponent currentPage={'members'} />
            <PageTitle pageName='Members' title='6sense Efficiency' />
            <section className="mt-[18px]">
                <div className='mr-auto text-base text-primary font-medium'>Members</div>
                <h3 className='text-headingXS md:text-headingBase font-semibold'>All Members</h3>
            </section>
            <section className="mt-4 relative">
                <div className="flex justify-center md:justify-end">
                    <Button onClick={handleDrawerOpen} prefixIcon='PlusCircle' type="button" className="w-full md:w-[153px]" prefixIconClassName='plusIcon' >Add Member</Button>
                </div>
                <div className="mt-4">
                    {
                        membersLoading ? <EmptyTableViewSkeleton /> : <MemberListView totalCountAndLimit={totalCountAndLimit} members={members} refetch={memberRefetch} />
                    }

                </div>
            </section>

            {isDrawerOpen && (
                <div className="relative">
                    <AddMemberDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} refetch={memberRefetch} />
                </div>
            )}

        </div>
    )
}

export default MemberList;