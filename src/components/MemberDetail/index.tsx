"use client";

import { cn } from "@/app/utils/tailwindMerge";
import { IMemberInfo } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import ImageComponent from "../ImageComponent";
import IconComponent from "../IconComponent";
import { Button } from "../ButtonComponent";
import MemberDetailListView from "../MemberDetailListView";
import ConfirmDialog from "../ConfirmDialog";
import { TEMP_BACKEND_URI } from "../../../globalConstants";

interface IProps {
  memberInformation?: IMemberInfo;
  totalCountAndLimit: { totalCount: number; size: number };
  onUpdate: () => void;
}
const MemberDetail = ({ onUpdate, memberInformation, totalCountAndLimit }: IProps): JSX.Element => {
  const router = useRouter();

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [avatarName, setAvatarName] = useState("");

  useEffect(() => {
    if (memberInformation && !memberInformation?.userData?.avatarUrls) {
      const memberNameArray = memberInformation && memberInformation?.userData?.displayName?.split(" ");
      if (memberNameArray && memberNameArray?.length > 1) {
        setAvatarName(memberNameArray?.[0]?.[0] + memberNameArray?.[1]?.[0]);
      }
      if (memberNameArray && memberNameArray?.length === 1) {
        setAvatarName(memberNameArray?.[0]?.[0]);
      }
    }
  }, [memberInformation]);

  const handleCloseDialog = (): void => {
    setIsOpenDialog(false);
  };

  const archiveMutation = useMutation({
    mutationKey: ["archive", memberInformation?.userData?._id],
    mutationFn: async () => {
      const res = await axios.put(`${TEMP_BACKEND_URI}/users/${memberInformation?.userData?._id}/archive`, null);
      return res.data;
    },
  });

  const handleConfirmDelete = (): void => {
    // Logic for archiving the member goes here

    archiveMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/member-list?page=1");
        handleCloseDialog();
      },
    });
  };

  const updateProfileMutation = useMutation({
    mutationKey: ["updateProfile", memberInformation?.userData?._id],
    mutationFn: async () => {
      const res = await axios.put(`${TEMP_BACKEND_URI}/jira/user/${memberInformation?.userData?._id}`, null);
      return res.data;
    },
  });

  const handleUpdateProfile = (): void => {
    updateProfileMutation.mutate(undefined, {
      onSuccess: () => {
        onUpdate();
      },
      onError: (error) => {
        console.error("Failed to update profile!", error);
      },
    });
  };

  return (
    <div className="mt-10 relative">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
        <div className={cn("flex flex-col md:flex-row items-start md:gap-2")}>
          {memberInformation?.userData?.avatarUrls ? (
            <ImageComponent
              src={memberInformation?.userData?.avatarUrls ?? ""}
              alt={"Pattern50 Logo"}
              width="w-[40px]"
              height="h-[40px]"
              imageClassName="rounded-full"
              className="text-left md:mt-1"
            />
          ) : (
            <span className="mt-1 w-[40px] h-[40px] bg-[#405A4C] rounded-full flex justify-center items-center text-white">{avatarName}</span>
          )}
          <div>
            <div className="flex gap-2 items-center">
              <h3 className="text-xl text-textSecondary font-semibold capitalize">{memberInformation?.userData?.displayName}</h3>
              <div id="profile-sync" onClick={handleUpdateProfile} className="cursor-pointer">
                <IconComponent
                  name={"ArrowsClockwise"}
                  color={""}
                  weight="regular"
                  className={cn("", {
                    "animate-spin": updateProfileMutation?.isPending,
                  })}
                />

                <Tooltip
                  anchorSelect="#profile-sync"
                  content="Sync Profile"
                  place="top"
                  offset={5}
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: "#BA8D46",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                />
              </div>
              {memberInformation?.projects?.map((proj, idx) => {
                return (
                  <p
                    key={idx}
                    className="mt-1 font-semibold text-xs capitalize rounded-2xl px-2 py-[2px] flex justify-center items-center text-primary bg-primary/10"
                  >
                    {proj?.projectDetails[0]?.name}
                  </p>
                );
              })}
            </div>
            <p className="text-sm text-subHeading">{memberInformation?.userData?.emailAddress}</p>
            <p className="text-sm text-subHeading">{memberInformation?.userData?.designation}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button
            prefixIcon="TrendUp"
            onClick={() => {
              router.push(`/member-list/${memberInformation?.userData?._id}/growth?page=1`);
            }}
          >
            Growth
          </Button>
          <Button
            onClick={() => {
              setIsOpenDialog(true);
            }}
            prefixIcon="Trash"
          >
            Archive
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <MemberDetailListView
          totalCountAndLimit={totalCountAndLimit}
          data={memberInformation?.history?.data}
          // accountId={`${memberInformation?._id}`}
          designation={`${memberInformation?.userData?.designation}`}
        />
      </div>
      {/* Modal */}
      {isOpenDialog && (
        <ConfirmDialog
          isLoading={archiveMutation.isPending}
          isOpen={isOpenDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          title="Are you sure to archive this member?"
        />
      )}
    </div>
  );
};

export default MemberDetail;
