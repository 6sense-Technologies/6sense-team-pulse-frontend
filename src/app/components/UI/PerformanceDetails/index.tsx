"use client";
import { cn } from "@/app/utils/tailwindMerge";
import { Tooltip } from 'react-tooltip';

const PerformanceDetails = (): JSX.Element => {

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
    return (
        <div className="flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="">
                                <tr className="">
                                    <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        NO.
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        DATE
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        USERNAME
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        TASK ID
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        TASK TYPE
                                    </th>
                                    <th id="tooltip-summary" scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        SUMMARY
                                        <Tooltip
                                            anchorSelect="#tooltip-summary"
                                            content="TASK SUMMARY"
                                            place="top"
                                            offset={0}
                                            style={{ backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                        />
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        STATUS
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        PLANNED
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        CHECKED
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs font-bold text-primaryFocus text-left text-wrap")}>
                                        LINK
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">Hello</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">Hello</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">Hello</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">Hello</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px] whitespace-nowrap">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">
                                            hello
                                        </p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">hello</p>
                                    </td>
                                    <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                        <p className="text-sm text-textSecondary font-semibold pb-[2px]">Hello</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceDetails;
