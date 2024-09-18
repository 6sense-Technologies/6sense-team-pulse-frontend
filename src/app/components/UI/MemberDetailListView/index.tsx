"use client";
import PaginationComponent from "@/app/components/UI/Pagination";
import { cn } from "@/app/utils/tailwindMerge";
import { IIssueHistory } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
    data: IIssueHistory[] | undefined
    totalCountAndLimit: { totalCount: number, size: number }
    accountId: string

}

const MemberDetailListView = ({ data, accountId, totalCountAndLimit }: IProps): JSX.Element => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(page);
    const router = useRouter();
    const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit?.size) : 0;

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        // Get the day, month (abbreviated), and year
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month: string = monthNames[date.getMonth()];

        // Construct the final formatted date
        return `${day} ${month}, ${year}`;
    }


    useEffect(() => {
        router.push(`/member-list/${accountId}?page=${currentPage}`);
    }, [currentPage, router, accountId]);

    return (
        <>
            {
                data && data.length > 0 ? (<div className="flow-root">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="">
                                        <tr>
                                            <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                DATE
                                            </th>
                                            <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                NO. OF TASKS
                                            </th>
                                            <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                NO. OF BUGS
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                NO. OF USERSTORIES
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                COMPLETED TASKS
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                COMPLETED USERSTORIES
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                TASK COMPLETION RATE
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                USERSTORY COMPLETION RATE
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                CODE TO BUG RATIO
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                OVERALL SCORE
                                            </th>
                                            <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                COMMENT
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {data?.map((info: IIssueHistory) => {
                                            return (
                                                <tr key={info?._id}>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{formatDate(info.date)}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.issuesCount?.notDone?.Task}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.issuesCount?.notDone?.Bug}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.issuesCount?.notDone?.Story}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                                            {info?.issuesCount?.done?.Task + info?.issuesCount?.done?.Bug}
                                                        </p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.issuesCount?.done?.Story}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.taskCompletionRate}%</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.userStoryCompletionRate}%</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">-</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.overallScore}%</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">-</p>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:justify-between">
                        <p className="text-gray-400 text-sm">
                            Showing {data.length} out of {totalCountAndLimit.totalCount}
                        </p>
                        <PaginationComponent currentPage={currentPage} totalPage={totalPages} onPageChange={onPageChange} />
                    </div>
                </div>) : <p className="text-textSecondary">No Data Found!</p>
            }
        </>
    );
};

export default MemberDetailListView;
