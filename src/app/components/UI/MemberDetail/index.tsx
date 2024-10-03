"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import ConfirmDialog from "@/app/components/UI/ConfirmDialog";
import IconComponent from "@/app/components/UI/IconComponent";
import ImageComponent from "@/app/components/UI/ImageComponent";
import MemberDetailListView from "@/app/components/UI/MemberDetailListView";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { cn } from "@/app/utils/tailwindMerge";
import { IMemberDetail } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IProps {
    data?: IMemberDetail,
    totalCountAndLimit: { totalCount: number, size: number }
}
const MemberDetail = ({ data, totalCountAndLimit }: IProps): JSX.Element => {

    const router = useRouter();

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleCloseDialog = (): void => {
        setIsOpenDialog(false);
    };

    const archiveMutation = useMutation({
        mutationKey: ["archive", data?.accountId],
        mutationFn: async () => {
            const res = await axios.put(`${BACKEND_URI}/users/${data?.accountId}/archive`, null);
            return res.data;
        }
    })

    const handleConfirmDelete = (): void => {
        // Logic for archiving the member goes here
        console.log("Member archived");

        archiveMutation.mutate(undefined, {
            onSuccess: () => {
                router.push("/member-list?page=1");
                handleCloseDialog();
            }
        });
    };

    return (
        <div className="mt-10 relative">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
                <div className={cn("flex flex-col md:flex-row items-start md:gap-2", { "md:items-center": !data?.emailAddress })}>

                    {
                        data?.avatarUrls ? <ImageComponent
                            src={data?.avatarUrls ?? ""}
                            alt={"Pattern50 Logo"}
                            width="w-[40px]"
                            height="h-[40px]"
                            imageClassName="rounded-full"
                            className="text-left md:mt-1"
                        />
                            :
                            <div className="w-10 h-10 p-2 rounded-full bg-pageBg flex justify-center items-center">
                                <IconComponent name="User" color={COLOR_SUBHEADING} fontSize={24} weight="regular" />
                            </div>

                    }
                    <div>
                        <h3 className="text-xl text-textSecondary font-semibold capitalize">{data?.displayName}</h3>
                        <p className="text-sm text-subHeading">
                            {data?.emailAddress}
                        </p>
                        <p className=" text-sm text-subHeading">
                            {data?.designation}
                        </p>
                    </div>
                </div>
                <div>
                    <Button onClick={() => { setIsOpenDialog(true); }} prefixIcon="Trash">Archive</Button>
                </div>
            </div>

            <div className="mt-8">
                <MemberDetailListView totalCountAndLimit={totalCountAndLimit} data={data?.issueHistory} accountId={`${data?.accountId}`} />
            </div>


            {/* Modal */}
            {isOpenDialog && (
                <ConfirmDialog isLoading={archiveMutation.isPending} isOpen={isOpenDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} title="Are you sure to archive this member?" />
            )}
        </div>
    )
}

export default MemberDetail