"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import ConfirmDialog from "@/app/components/UI/ConfirmDialog";
import IconComponent from "@/app/components/UI/IconComponent";
import ImageComponent from "@/app/components/UI/ImageComponent";
import MemberDetailListView from "@/app/components/UI/MemberDetailListView";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { cn } from "@/app/utils/tailwindMerge";
import { IMemberDetail } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

interface IProps {
    data?: IMemberDetail,
    totalCountAndLimit: { totalCount: number, size: number },
    onUpdate: () => void;
}
const MemberDetail = ({ onUpdate, data, totalCountAndLimit }: IProps): JSX.Element => {

    const router = useRouter();

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [avatarName, setAvatarName] = useState("");

    useEffect(() => {
        if (data && !data?.avatarUrls) {
            const memberNameArray = data && data?.displayName?.split(" ");
            if (memberNameArray && memberNameArray?.length > 1) {
                setAvatarName(memberNameArray?.[0]?.[0] + memberNameArray?.[1]?.[0])
            }
            if (memberNameArray && memberNameArray?.length === 1) {
                setAvatarName(memberNameArray?.[0]?.[0])
            }
        }
    }, [data]);

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

    const updateProfileMutation = useMutation({
        mutationKey: ["updateProfile", data?.accountId],
        mutationFn: async () => {
            const res = await axios.put(`${BACKEND_URI}/jira/user/${data?.accountId}`, null);
            return res.data;
        }
    })

    const handleUpdateProfile = (): void => {
        updateProfileMutation.mutate(undefined, {
            onSuccess: () => {
                console.log("Updated Profile Successfully!");
                onUpdate();
            },
            onError: (error) => {
                console.error("Failed to update profile!", error);
            }
        })
    }

    return (
        <div className="mt-10 relative">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
                <div className={cn("flex flex-col md:flex-row items-start md:gap-2")}>

                    {
                        data?.avatarUrls ?
                            <ImageComponent
                                src={data?.avatarUrls ?? ""}
                                alt={"Pattern50 Logo"}
                                width="w-[40px]"
                                height="h-[40px]"
                                imageClassName="rounded-full"
                                className="text-left md:mt-1"
                            />
                            :
                            <span className="mt-1 w-[40px] h-[40px] bg-[#405A4C] rounded-full flex justify-center items-center text-white">
                                {avatarName}
                            </span>

                    }
                    <div>
                        <div className="flex gap-2 items-center">
                            <h3 className="text-xl text-textSecondary font-semibold capitalize">{data?.displayName}</h3>
                            <div id="profile-sync" onClick={handleUpdateProfile} className="cursor-pointer">
                                <IconComponent name={'ArrowsClockwise'} color={''} weight="regular" className={cn("", {
                                    "animate-spin": updateProfileMutation?.isPending
                                })} />

                                <Tooltip
                                    anchorSelect="#profile-sync"
                                    content="Sync Profile"
                                    place="top"
                                    offset={5}
                                    style={{ fontSize: "12px", fontWeight: "bold", backgroundColor: '#BA8D46', color: 'white', borderRadius: '5px', padding: '5px' }}
                                />
                            </div>
                            <p className="mt-1 font-semibold text-xs capitalize rounded-2xl px-2 py-[2px] flex justify-center items-center text-primary bg-primary/10">{data?.project}</p>
                        </div>
                        <p className="text-sm text-subHeading">
                            {data?.emailAddress}
                        </p>
                        <p className="text-sm text-subHeading">
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