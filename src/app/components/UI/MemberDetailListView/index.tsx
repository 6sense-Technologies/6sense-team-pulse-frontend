"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import DialogForm from "@/app/components/UI/DialogForm";
import PaginationComponent from "@/app/components/UI/Pagination";
import { cn } from "@/app/utils/tailwindMerge";
import { IIssueHistory } from "@/types/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip';

interface IProps {
    data: IIssueHistory[] | undefined;
    totalCountAndLimit: { totalCount: number; size: number; };
    accountId: string;
}

const MemberDetailListView = ({ data, accountId, totalCountAndLimit }: IProps): JSX.Element => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(page);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [currentDate, setCurrentDate] = useState("");

    const router = useRouter();
    const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size) : 0;

    useEffect(() => {
        router.push(`/member-list/${accountId}?page=${currentPage}`);
    }, [currentPage, router, accountId]);

    const onPageChange = (page: number): void => setCurrentPage(page);

    const handleCloseDialog = (): void => setIsOpenDialog(false);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${day} ${monthNames[date.getMonth()]} ${year}`;
    };

    const renderTooltip = (id: string, content: string) => (
        <Tooltip
            className="z-10"
            anchorSelect={`#${id}`}
            content={content}
            place="top"
            offset={0}
            style={{ width: "200px", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
        />
    );

    const renderTableHeaders = () => (
        <thead className="bg-bgSecondary">
            <tr>
                <th scope="col" className={cn("w-[11%] pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>DATE</th>
                {["TASKS", "BUGS", "STORIES", "CT", "CB", "CU", "TCR", "USCR", "CTBR", "SCORE"].map((title, index) => (
                    <th id={`tooltip-${title.toLowerCase()}`} key={title} scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                        {title}
                        {renderTooltip(`tooltip-${title.toLowerCase()}`, `NO. OF ${title}`)}
                    </th>
                ))}
                <th scope="col" className={cn("w-[10%] py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>COMMENT</th>
                <th scope="col" className={cn("flex justify-center items-center py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>ACTION</th>
            </tr>
        </thead>
    );

    const renderTableRow = (info: IIssueHistory, index: number) => {
        const isLeave = info?.comment === "holidays/leave";
        const renderData = (data: number | string | undefined) => isLeave ? "-" : data;

        return (
            <tr key={info?._id} className={cn({ "bg-red-50": isLeave })}>
                <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                    <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">{formatDate(info.date)}</p>
                </td>
                {[
                    info?.issuesCount?.notDone?.Task,
                    info?.issuesCount?.notDone?.Bug,
                    info?.issuesCount?.notDone?.Story,
                    info?.issuesCount?.done?.Task,
                    info?.issuesCount?.done?.Bug,
                    info?.issuesCount?.done?.Story,
                    info?.taskCompletionRate?.toFixed(2),
                    info?.userStoryCompletionRate?.toFixed(2),
                    info?.codeToBugRatio?.toFixed(2),
                    info?.overallScore?.toFixed(2),
                ].map((value, idx) => (
                    <td key={idx} className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{renderData(value)}{typeof value === 'number' ? "%" : ""}</p>
                    </td>
                ))}
                <td className="py-2 pl-3 text-sm text-textSecondary">
                    <div className={cn("items-center gap-0 cursor-pointer", { "flex": info?.comment })}>
                        <p id={info?.comment ? `tooltip-comment-${index}` : undefined} className={cn("text-sm text-textSecondary font-semibold pb-[2px]", { "truncate max-w-[100px] w-full": info?.comment })}>
                            {renderData(info?.comment)}
                        </p>
                        {info?.comment && info?.comment.length > 15 && renderTooltip(`tooltip-comment-${index}`, info?.comment)}
                    </div>
                </td>
                <td className="py-2 pl-3 text-sm text-textSecondary">
                    <div className="flex justify-center items-center gap-2">
                        <Button
                            aria-label="details"
                            role="button"
                            disabled={isLeave}
                            variant={isLeave ? "ghost" : "secondary"}
                            className={cn("disabled:bg-transparent text-textPrimary font-medium px-4 py-2 focus:outline-[0px]")}
                        >
                            <Link href={`/member-list/${accountId}/${info?.date}`}>Details</Link>
                        </Button>
                        <Button
                            onClick={() => {
                                setIsOpenDialog(true);
                                setCurrentDate(info?.date);
                            }}
                            aria-label="report bug"
                            role="button"
                            disabled={isLeave}
                            variant={isLeave ? "ghost" : "secondary"}
                            className={cn("disabled:bg-transparent text-textPrimary font-medium px-4 py-2 focus:outline-[0px]")}
                        >
                            Report bug
                        </Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <>
            {data && data.length > 0 ? (
                <div className="flow-root">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-300">
                                {renderTableHeaders()}
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data.map(renderTableRow)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-2 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:justify-between">
                        <p className="text-gray-400 text-sm">
                            Showing {data.length} out of {totalCountAndLimit.totalCount} result{`${totalCountAndLimit.totalCount > 1 ? "s" : ""}`}
                        </p>
                        <PaginationComponent currentPage={currentPage} totalPage={totalPages} onPageChange={onPageChange} />
                    </div>
                </div>
            ) : (
                <p className="text-textSecondary">No Data Found!</p>
            )}
            {isOpenDialog && (
                <DialogForm currentDate={currentDate} accountId={accountId} isOpen={isOpenDialog} onClose={handleCloseDialog} />
            )}
        </>
    );
};

export default MemberDetailListView;
