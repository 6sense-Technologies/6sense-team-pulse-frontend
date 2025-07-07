"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { GetIndividualTeamMember } from "../../../../../../helpers/Member/memberApi";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AvatarMenu from "@/components/AvatarMenu";
import GlobalBreadCrumb from "@/components/globalBreadCrumb";
import PageHeading from "@/components/pageHeading";
import Image from "next/image";
import FeedbackForm from "./_components/feedbackForm";
import Loader from "@/components/loader";

const MemberIdPage = () => {
  const session = useSession();
  const params = useParams();
  const memberId = params.memberId;

  const { data: individualMemberData, isFetching: individualMemberDataLoading } = useQuery<any>({
    queryKey: ["individualMemberData", memberId],
    queryFn: () => GetIndividualTeamMember(memberId as string, session),
  });

  return (
    <div className="w-full">
      <PageTitle title="Projects • Ops4 Team" />

      <div className="pl-4 pt-8 lg:pt-8 pr-[14px] w-full">
        <div className="md:hidden pb-4 flex justify-between items-center">
          <span className="md:hidden pl-1">
            <SidebarTrigger />
          </span>
          <AvatarMenu />
        </div>

        <div className="flex justify-between items-center">
          <GlobalBreadCrumb initialData="Send Feedback" initalLink="/feedback/send-feedback" secondayData="Member" />
          <span className="hidden md:flex pr-2">
            <AvatarMenu />
          </span>
        </div>

        {individualMemberDataLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <>
            <PageHeading title={individualMemberData?.userData?.displayName} />

            <div className="max-w-2xl mt-6">
              <div className="flex items-center bg-[#F1F5F9] rounded-xl p-3 gap-4 mb-6">
                <div>
                  <Image
                    src={individualMemberData?.userData?.avatarUrls}
                    alt={individualMemberData?.userData?.displayName}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{individualMemberData?.userData?.displayName}</p>
                  <p className="font-normal text-xs leading-4 text-[#334155]">{individualMemberData?.userData?.designation}</p>
                  <p className="font-normal text-sm leading-5 mt-2">{individualMemberData?.userData?.emailAddress}</p>
                </div>
              </div>

              <FeedbackForm memberId={memberId as string} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberIdPage;
