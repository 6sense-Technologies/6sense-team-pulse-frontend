"use client";
import { cn } from "@/app/utils/tailwindMerge";
import { IMemberPerformanceIssueHistory } from "@/types/types";
import { Tooltip } from "react-tooltip";

interface IProps {
    data: IMemberPerformanceIssueHistory | undefined,
    date: string
}

const PerformanceDetails = ({ data, date }: IProps): JSX.Element => {

    const userName: string = data?.userName ?? "-";

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

    if (!data) return <p>No Data Found!</p>

    return (
        <div className="flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-bgSecondary">
                                <tr className="">
                                    <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        NO.
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        DATE
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        USERNAME
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        ID
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        TYPE
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        TITLE
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        STATUS
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        PLAN STATUS
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        LINKED IDS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {
                                    data?.issues?.map((info, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.serialNumber}</p>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
<<<<<<< HEAD
                                                    <p className="w-[80px] text-sm text-textSecondary font-semibold pb-[2px]">{formatDate(date)}</p>
=======
                                                    <p className="w-[80px] md:w-full text-sm text-textSecondary font-semibold pb-[2px]">{formatDate(date)}</p>
>>>>>>> f63b38c95ccd916f84984b18ef47d00407980573
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    <p className="w-[80px] md:w-full text-sm text-textSecondary font-semibold pb-[2px]">
                                                        {userName}
                                                    </p>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                                        {info?.issueId}
                                                    </p>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.issueType}</p>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    {/* <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.issueSummary ? info?.issueSummary : "-"}</p> */}

                                                    <div
                                                        className={cn(
                                                            "items-center gap-0 cursor-pointer",
                                                            { "flex": info?.issueSummary }
                                                        )}
                                                    >
                                                        <p id={info?.issueSummary ? `tooltip-issueSummary-${index}` : undefined} className={cn(
                                                            "text-sm text-textSecondary font-semibold pb-[2px]",
                                                            { "truncate max-w-[150px] w-full": info?.issueSummary }
                                                        )}>
                                                            {info?.issueSummary ? info.issueSummary : "-"}
                                                        </p>
                                                        {info?.issueSummary && <Tooltip
                                                            anchorSelect={`#tooltip-issueSummary-${index}`}
                                                            content={info?.issueSummary}
                                                            place="top"
                                                            offset={0}
                                                            style={{ width: "200px", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                        />}
                                                    </div>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    <p className="w-[100px] md:w-full text-xs text-textSecondary font-semibold pb-[2px] uppercase">
                                                        {/* <span className={cn("border rounded-2xl px-3 py-[3px] text-white uppercase text-xs", {
                                                            "bg-green-400": info?.issueStatus === "Done",
                                                            "bg-emerald-400	": info?.issueStatus === "IN TESTING",
                                                            "bg-yellow-400": info?.issueStatus === "To Do",
                                                            "bg-emerald-500": info?.issueStatus === "User Stories (In progress)",
                                                        })}>
                                                            {info?.issueStatus}
                                                        </span> */}
                                                        {info?.issueStatus}
                                                    </p>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    <p className="w-[80px] md:w-full text-sm text-textSecondary font-semibold pb-[2px]">{info?.planned ? "Planned" : "Unplanned"}</p>
                                                </td>
                                                <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                    {/* <p className="text-sm text-textSecondary font-semibold pb-[2px]">{info?.link ? info?.link : "-"}</p> */}
                                                    {/* <div
                                                        className={cn(
                                                            "items-center gap-0 cursor-pointer",
                                                            { "flex": info?.link }
                                                        )}
                                                    >
                                                        <p id={info?.link ? `tooltip-link-${index}` : undefined} className={cn(
                                                            "text-sm text-textSecondary font-semibold pb-[2px]",
                                                            { "truncate max-w-[100px] w-full": info?.link }
                                                        )}>
                                                            {info?.link ? info.link : "-"}
                                                        </p>
                                                        {info?.link?.length > 10 && <Tooltip
                                                            anchorSelect={`#tooltip-link-${index}`}
                                                            content={info?.link}
                                                            place="top"
                                                            offset={5}
                                                            style={{ width: "200px", whiteSpace: "normal", wordBreak: "break-word", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                                        />}
                                                    </div> */}

                                                    <p className="w-[150px] text-sm text-textSecondary font-semibold pb-[2px] whitespace-normal break-words">{info?.link ? info.link : "-"}</p>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceDetails;
