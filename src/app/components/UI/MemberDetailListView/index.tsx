"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import CommentDialog from "@/app/components/UI/CommentDialog";
import DialogForm from "@/app/components/UI/DialogForm";
import PaginationComponent from "@/app/components/UI/Pagination";
import { COLOR_TEXT_PRIMARY } from "@/app/utils/colorUtils";
import { cn } from "@/app/utils/tailwindMerge";
import { IIssueHistory } from "@/types/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip';

interface IProps {
    data: IIssueHistory[] | undefined
    totalCountAndLimit: { totalCount: number, size: number }
    accountId: string
}

const MemberDetailListView = ({ data, accountId, totalCountAndLimit }: IProps): JSX.Element => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(page);
    const [isOpenBugReportDialog, setIsOpenBugReportDialog] = useState(false);
    const [isOpenCommentDialog, setIsOpenCommentDialog] = useState(false);
    const [currentDate, setCurrentDate] = useState("");

    const router = useRouter();
    const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit?.size) : 0;

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const handleCloseBugReportDialog = (): void => {
        setIsOpenBugReportDialog(false);
    };

    const handleCloseCommentDialog = (): void => {
        setIsOpenCommentDialog(false);
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        // Get the day, month (abbreviated), and year
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month: string = monthNames[date.getMonth()];

        // Construct the final formatted date
        return `${day} ${month} ${year}`;
    }

    useEffect(() => {
        router.push(`/member-list/${accountId}?page=${currentPage}`);
    }, [currentPage, router, accountId]);

    return (
        <>
            {
                data && data.length > 0 ? <div className="flow-root">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="">
                                <table className="min-w-[1046px] w-full divide-y divide-gray-300">
                                    <thead className="bg-bgSecondary">
                                        <tr className="">
                                            <th scope="col" className={cn("w-[11%] pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                DATE
                                            </th>
                                            <th id="tooltip-task" scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                TASKS
                                                <Tooltip
                                                    anchorSelect="#tooltip-task"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                    render={() => {
                                                        return (
                                                            <>
                                                                <span>COMPLETED / TOTAL</span> <br />
                                                                <span>
                                                                    TCR - TASK COMPLETION RATE
                                                                </span>
                                                            </>
                                                        )
                                                    }}
                                                />
                                            </th>
                                            <th id="tooltip-bugs" scope="col" className={cn("py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                BUGS
                                                <Tooltip
                                                    anchorSelect="#tooltip-bugs"
                                                    content="COMPLETED / TOTAL"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th>
                                            <th id="tooltip-stories" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                STORIES
                                                <Tooltip
                                                    anchorSelect="#tooltip-stories"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                    render={() => {
                                                        return (
                                                            <>
                                                                <span>COMPLETED / TOTAL</span> <br />
                                                                <span>
                                                                    USCR - USER STORY COMPLETION RATE
                                                                </span>
                                                            </>
                                                        )
                                                    }}
                                                />
                                            </th>
                                            {/* <th id="tooltip-com" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                CT
                                                <Tooltip
                                                    anchorSelect="#tooltip-com"
                                                    content="NO. OF COMPLETED TASKS"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th> */}
                                            {/* <th id="tooltip-com-bug" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                CB
                                                <Tooltip
                                                    anchorSelect="#tooltip-com-bug"
                                                    content="NO. OF COMPLETED BUGS"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th> */}
                                            {/* <th id="tooltip-story" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                CU
                                                <Tooltip
                                                    anchorSelect="#tooltip-story"
                                                    content="COMPLETED USERSTORIES"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th> */}
                                            {/* <th id="tooltip-task-com" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                TCR
                                                <Tooltip
                                                    anchorSelect="#tooltip-task-com"
                                                    content="TASK COMPLETION RATE"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th> */}
                                            {/* <th id="tooltip-us-com" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                USCR
                                                <Tooltip
                                                    anchorSelect="#tooltip-us-com"
                                                    content="USERSTORIES COMPLETION RATE"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th> */}
                                            <th id="tooltip-ctbr" scope="col" className={cn("py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                CTBR
                                                <Tooltip
                                                    anchorSelect="#tooltip-ctbr"
                                                    content="CODE TO BUG RATIO"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th>
                                            <th id="tooltip-score" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                SCORE
                                                <Tooltip
                                                    anchorSelect="#tooltip-score"
                                                    content="OVERALL SCORE"
                                                    place="top"
                                                    offset={0}
                                                    style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                />
                                            </th>
                                            <th scope="col" className={cn("py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                INSIGHT
                                            </th>
                                            <th scope="col" className={cn("pl-2 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                                ACTION
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {data?.map((info: IIssueHistory, index) => {

                                            return (
                                                <tr key={info?._id}
                                                    className={cn("", { "bg-red-50": info?.comment === "holidays/leave" })}
                                                >
                                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">{formatDate(info.date)}</p>
                                                    </td>
                                                    <td className={cn("pl-6 py-2 text-sm text-textSecondary")}>
                                                        {
                                                            info?.comment === "holidays/leave" ? "-" :
                                                                <>
                                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">{`${info?.issuesCount?.done?.Task}/${info?.issuesCount?.notDone?.Task}`}</p>
                                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">{`TCR: ${info?.taskCompletionRate?.toFixed(2)}%`}</p>
                                                                </>
                                                        }
                                                    </td>
                                                    <td className={cn("py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.comment === "holidays/leave" ? "-" : `${info?.issuesCount?.done?.Bug}/${info?.issuesCount?.notDone?.Bug}`}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        {
                                                            info?.comment === "holidays/leave" ? "-"
                                                                :
                                                                <>
                                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">{`${info?.issuesCount?.done?.Story}/${info?.issuesCount?.notDone?.Story}`}</p>

                                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">{`USCR: ${info?.userStoryCompletionRate?.toFixed(2)}%`}</p>
                                                                </>
                                                        }

                                                    </td>
                                                    {/* <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                                            {info?.comment === "holidays/leave" ? "-" : info?.issuesCount?.done?.Task}
                                                        </p>
                                                    </td> */}
                                                    {/* <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                                            {info?.comment === "holidays/leave" ? "-" : info?.issuesCount?.done?.Bug}
                                                        </p>
                                                    </td> */}
                                                    {/* <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.comment === "holidays/leave" ? "-" : info?.issuesCount?.done?.Story}</p>
                                                    </td> */}
                                                    {/* <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.comment === "holidays/leave" ? "-" : `${info?.taskCompletionRate?.toFixed(2)}%`}</p>
                                                    </td> */}
                                                    {/* <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.comment === "holidays/leave" ? "-" : `${info?.userStoryCompletionRate?.toFixed(2)}%`}</p>
                                                    </td> */}
                                                    <td className={cn("py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.comment === "holidays/leave" ? "-" : `${info?.codeToBugRatio?.toFixed(2)}%`}</p>
                                                    </td>
                                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.comment === "holidays/leave" ? "-" : `${info?.overallScore?.toFixed(2)}%`}</p>
                                                    </td>
                                                    <td className={cn("w-[340px] py-2 text-sm text-textSecondary")}>
                                                        <div
                                                            className={cn(
                                                                "items-center gap-0 cursor-pointer",
                                                                { "flex": info?.comment }
                                                            )}
                                                        >
                                                            <p id={info?.comment ? `tooltip-comment-${index}` : undefined} className={cn(
                                                                "text-sm text-textSecondary font-semibold pb-[2px]",
                                                                { "max-w-[290px] w-full": info?.comment }
                                                            )}>
                                                                {info?.comment ? info.comment : "-"}
                                                            </p>
                                                            {/* {info?.comment && info?.comment?.length > 15 && <Tooltip
                                                                className="z-10"
                                                                anchorSelect={`#tooltip-comment-${index}`}
                                                                content={info?.comment}
                                                                place="left"
                                                                offset={5}
                                                                style={{ width: "200px", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                            />} */}
                                                        </div>
                                                    </td>

                                                    <td className="py-2 text-sm text-textSecondary">
                                                        <div className="flex justify-start items-center gap-3">
                                                            <>
                                                                <Button id={`tooltip-put-comment-${index}`} onClick={() => {
                                                                    setIsOpenCommentDialog(true);
                                                                    setCurrentDate(info?.date);
                                                                }} weight="regular" className="focus:outline-[0px] p-0" disabled={info?.comment === "holidays/leave"} variant={"ghost"} prefixIcon="ChatCircleText" prefixIconColor={COLOR_TEXT_PRIMARY} />

                                                                <Tooltip
                                                                    anchorSelect={`#tooltip-put-comment-${index}`}
                                                                    content="ADD COMMENT"
                                                                    place="top"
                                                                    offset={0}
                                                                    style={{ fontSize: "12px", fontWeight: "bold", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                                />
                                                            </>

                                                            <>
                                                                <Button weight="regular" id={`report-bug-${index}`} onClick={() => {
                                                                    setIsOpenBugReportDialog(true);
                                                                    setCurrentDate(info?.date);
                                                                }} className="focus:outline-[0px] p-0" disabled={info?.comment === "holidays/leave"} variant={"ghost"} prefixIcon="Bug" prefixIconColor={COLOR_TEXT_PRIMARY} />
                                                                <Tooltip
                                                                    anchorSelect={`#report-bug-${index}`}
                                                                    content="REPORT BUG"
                                                                    place="top"
                                                                    offset={0}
                                                                    style={{ fontSize: "12px", fontWeight: "bold", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                                />
                                                            </>

                                                            <Link id={`detail-${index}`} href={info?.comment === "holidays/leave" ? "#" : `/member-list/${accountId}/${info?.date}`}>
                                                                <Button weight="regular" className="focus:outline-[0px] p-0" disabled={info?.comment === "holidays/leave"} variant={"ghost"} prefixIcon="CaretRight" prefixIconColor={COLOR_TEXT_PRIMARY} />

                                                                <Tooltip
                                                                    anchorSelect={`#detail-${index}`}
                                                                    content="DETAILS"
                                                                    place="top"
                                                                    offset={0}
                                                                    style={{ fontSize: "12px", fontWeight: "bold", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                                />
                                                            </Link>

                                                        </div>
                                                        {/* <Button onClick={() => {
                                                                setIsOpenBugReportDialog(true);
                                                                setCurrentDate(info?.date);
                                                            }} aria-label="details" role="button" disabled={info?.comment === "holidays/leave"} variant={`${info?.comment === "holidays/leave" ? "ghost" : "secondary"}`} className={cn("disabled:bg-transparent text-textPrimary font-medium px-4 py-2 focus:outline-[0px]")}>
                                                                Report bug
                                                            </Button> */}

                                                    </td>

                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div >

                    <div className="mt-2 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:justify-between">
                        <p className="text-gray-400 text-sm">
                            Showing {data.length} out of {totalCountAndLimit.totalCount} result{`${totalCountAndLimit.totalCount > 1 ? "s" : ""}`}
                        </p>
                        <PaginationComponent currentPage={currentPage} totalPage={totalPages} onPageChange={onPageChange} />
                    </div>
                </div > : <p className="text-textSecondary">No Data Found!</p>
            }

            {/* Modal */}
            {
                isOpenBugReportDialog && (
                    <DialogForm currentDate={`${currentDate}`} accountId={`${accountId}`} isOpen={isOpenBugReportDialog} onClose={handleCloseBugReportDialog} />
                )
            }
            {
                isOpenCommentDialog && (
                    <CommentDialog commentAdded={() => { console.log("Added comment") }} currentDate={`${currentDate}`} accountId={`${accountId}`} isOpen={isOpenCommentDialog} onClose={handleCloseCommentDialog} />
                )
            }
        </>
    );
};

export default MemberDetailListView;
