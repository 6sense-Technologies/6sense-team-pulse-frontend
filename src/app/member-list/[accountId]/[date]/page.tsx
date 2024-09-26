"use client";
import IconComponent from "@/app/components/UI/IconComponent";
import MenuComponent from "@/app/components/UI/MenuComponent";
import PageTitle from "@/app/components/UI/PageTitle";
import PerformanceDetails from "@/app/components/UI/PerformanceDetails";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

const MemberPerformanceDetails = (): JSX.Element => {
    const { accountId, date } = useParams();

    const { data, isFetching: performanceLoading } = useQuery({
        queryKey: ["fetchMemberPerformanceDetails", accountId, date],
        queryFn: async () => {
            const res = await axios.get(`${BACKEND_URI}/users/${accountId}/${date}`);

            return res.data;
        }
    })

    return (
        <div className='relative adjustedWidthForMenu px-6 md:left-[280px]'>
            <MenuComponent currentPage={'members'} />
            <PageTitle pageName='Performance Details' title='6sense Efficiency' />
            <section className="mt-[18px]">
                <div className='mr-auto text-base text-primary font-medium'>Information</div>
                <h3 className='text-headingXS md:text-headingBase font-semibold'>Performance Details</h3>
            </section>
            <section className="mt-8 relative">
                {
                    performanceLoading ? <div className="flex justify-center items-center min-h-[75vh] md:min-h-[75vh]"><IconComponent name={'loader'} color={'#BA8D46'} className='animate-spin' fontSize={40} /></div> : <PerformanceDetails />
                }
            </section>
        </div>
    )
}

export default MemberPerformanceDetails;