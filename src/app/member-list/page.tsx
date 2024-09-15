"use client";
import AddMemberDrawer from "@/app/components/UI/AddMemberDrawer";
import { Button } from "@/app/components/UI/ButtonComponent";
import MemberListView from "@/app/components/UI/MemberListView";
import MenuComponent from "@/app/components/UI/MenuComponent";
import PageTitle from "@/app/components/UI/PageTitle";
import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useState } from "react";

const MemberList = (): JSX.Element => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleDrawerOpen = (): void => { setIsDrawerOpen(true) };
    const handleDrawerClose = (): void => { setIsDrawerOpen(false) };

    // const searchParams = useSearchParams();

    // const [pagination, setPagination] = useState({
    //     page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    //     size: 10,
    //     // query: searchParams.get("query") ?? "",
    // });

    return (
        <div className='relative adjustedWidthForMenu px-6 md:left-[280px]'>
            <MenuComponent currentPage={'members'} />
            <PageTitle pageName='Members' title='6sense Efficiency' />
            <section className="mt-[18px]">
                <div className='mr-auto text-base text-primary font-medium'>Members</div>
                <h3 className='text-headingXS md:text-headingBase font-semibold'>All Members</h3>
            </section>
            <section className="mt-4 relative">
                {/* <EmptyTableViewSkeleton /> */}
                <div className="flex justify-center md:justify-end">
                    <Button onClick={handleDrawerOpen} prefixIcon='PlusCircle' type="button" className="w-full md:w-[153px] " prefixIconClassName='plusIcon' >Add Member</Button>
                </div>
                <div>
                    <MemberListView />
                </div>
            </section>

            {isDrawerOpen && (
                <div className="relative">
                    <AddMemberDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
                </div>
            )}

        </div>
    )
}

export default MemberList