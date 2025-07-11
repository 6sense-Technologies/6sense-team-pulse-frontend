"use client";
import { Button } from "@/components/ButtonComponent";
import ImageComponent from "@/components/ImageComponent";
import PaginationComponent from "@/components/Pagination";
import { cn } from "@/app/utils/tailwindMerge";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
///
interface IProps {
    _id: string;
    accountId: string;
    displayName: string;
    emailAddress: string;
    avatarUrls: string;
    currentPerformance: number;
    designation: string
}

const MemberListView = ({ members, refetch, totalCountAndLimit }: { members: IProps[], totalCountAndLimit: { totalCount: number, size: number }, refetch: () => void }): JSX.Element => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams?.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(page);
    const router = useRouter();
    const totalPages = totalCountAndLimit.totalCount ? Math.ceil(totalCountAndLimit.totalCount / totalCountAndLimit.size) : 0;

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
        refetch();
    };

    useEffect(() => {
        router.push(`/member-list?page=${currentPage}`);
    }, [currentPage, router]);

    return (
        <div className="flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-bgSecondary">
                                <tr>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        PHOTO
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        NAME
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        EMAIL
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        DESIGNATION
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        OVERALL PERFORMANCE
                                    </th>
                                    <th scope="col" className="py-2 pl-3 pr-16 text-xs md:text-sm font-bold text-primaryFocus text-left z-10">
                                        ACTION
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {members.map((member: IProps) => {

                                    let avatarName = "";
                                    const memberNameArray = member?.displayName?.split(" ");
                                    if (memberNameArray?.length > 1) {
                                        avatarName = memberNameArray?.[0]?.[0] + memberNameArray?.[1]?.[0];
                                    }
                                    if (memberNameArray?.length === 1) {
                                        avatarName = memberNameArray?.[0]?.[0];
                                    }

                                    return (
                                        <tr key={member?._id}>
                                            <td className={cn("py-2 pl-6 text-textSecondary")}>
                                                <div className={cn("w-10 h-10 p-2 rounded-full bg-pageBg flex justify-center items-center")}>
                                                    {
                                                        member?.avatarUrls ?
                                                            <ImageComponent
                                                                src={member?.avatarUrls}
                                                                alt="Member Information"
                                                                width="w-full"
                                                                height="h-full"
                                                                imageClassName="rounded-full"
                                                            />
                                                            // <div className="w-10 h-10 p-2 rounded-full bg-pageBg flex justify-center items-center">
                                                            //     <span className="w-6 h-6 bg-[#405A4C] rounded-full text-[11px] flex justify-center items-center text-white">
                                                            //         {avatarName}
                                                            //     </span>
                                                            // </div>
                                                            :
                                                            (
                                                                <div className="w-10 h-10 p-2 rounded-full bg-pageBg flex justify-center items-center">
                                                                    <span className="w-6 h-6 bg-[#405A4C] rounded-full text-[11px] flex justify-center items-center text-white">
                                                                        {avatarName}
                                                                    </span>
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </td>
                                            <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px] capitalize">{member?.displayName}</p>
                                            </td>
                                            <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px]">{member?.emailAddress ? member?.emailAddress : "-"}</p>
                                            </td>
                                            <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px]">{member?.designation ?? "-"}</p>
                                            </td>
                                            <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px]">{member?.currentPerformance.toFixed(2)}%</p>
                                            </td>
                                            <td className="px-3 pl-3 py-2 text-sm text-textSecondary"> {/* Added bg-white to sticky cell */}
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/member-list/${member?._id}?page=1`}>
                                                        <Button aria-label="details" role="button" variant="secondary" className={cn("text-textPrimary font-medium px-4 py-2 focus:outline-[0px]")}>
                                                            Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-2 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:justify-between">
                <p className="text-gray-400 text-sm">
                    Showing {members.length} out of {totalCountAndLimit.totalCount} result{`${totalCountAndLimit.totalCount > 1 ? "s" : ""}`}
                </p>
                <PaginationComponent currentPage={currentPage} totalPage={totalPages} onPageChange={onPageChange} />
            </div>

        </div>
    );
};

export default MemberListView;
