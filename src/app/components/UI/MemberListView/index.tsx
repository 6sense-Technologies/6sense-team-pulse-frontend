"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import IconComponent from "@/app/components/UI/IconComponent";
import ImageComponent from "@/app/components/UI/ImageComponent";
import PaginationComponent from "@/app/components/UI/Pagination";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { cn } from "@/app/utils/tailwindMerge";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
interface IProps {
    _id: string;
    accountId: string;
    displayName: string;
    emailAddress: string;
    avatarUrls: string;
    currentPerformance: number;
}

const MemberListView = ({ members, refetch, totalCountAndLimit }: { members: IProps[], totalCountAndLimit: { totalCount: number, size: number }, refetch: () => void }): JSX.Element => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
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
                            <thead className="">
                                <tr>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        PHOTO
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        NAME
                                    </th>
                                    <th scope="col" className={cn("pl-6 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        DESIGNATION
                                    </th>
                                    <th scope="col" className={cn("pl-4 py-2 text-xs md:text-sm font-bold text-primaryFocus text-left")}>
                                        OVERALL PERFORMANCE
                                    </th>
                                    <th scope="col" className="sticky right-0 bg-white py-2 pl-3 pr-16 text-xs md:text-sm font-bold text-primaryFocus text-left z-10">
                                        ACTION
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {members.map((member: IProps) => {
                                    return (
                                        <tr key={member._id}>
                                            <td className={cn("py-2 pl-6 text-textSecondary")}>
                                                <div className={cn("w-10 h-10 p-2 rounded-full bg-pageBg flex justify-center items-center")}>
                                                    {
                                                        member?.avatarUrls ? <ImageComponent src={member?.avatarUrls} alt="Member Information" width="w-full" height="h-full" imageClassName="rounded-full" /> : <IconComponent name="User" color={COLOR_SUBHEADING} fontSize={24} weight="regular" />

                                                    }
                                                </div>
                                            </td>
                                            <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px]">{member.displayName}</p>
                                            </td>
                                            <td className={cn("px-3 pl-6 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px]">Designation</p>
                                            </td>
                                            <td className={cn("px-3 pl-4 py-2 text-sm text-textSecondary")}>
                                                <p className="text-sm text-textSecondary font-semibold pb-[2px]">{member.currentPerformance}%</p>
                                            </td>
                                            <td className="sticky right-0 px-3 pl-3 py-2 text-sm text-textSecondary bg-white z-10"> {/* Added bg-white to sticky cell */}
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/member-list/${member.accountId}`}>
                                                        <Button variant="ghost" className={cn("text-textPrimary font-medium px-0 focus:outline-[0px]")}>
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

            <PaginationComponent currentPage={currentPage} totalPage={totalPages} onPageChange={onPageChange} />
        </div>
    );
};

export default MemberListView;
