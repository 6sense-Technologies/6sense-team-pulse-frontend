"use client";
import { Button } from "@/app/components/UI/ButtonComponent";
import CommentDialog from "@/app/components/UI/CommentDialog";
import EmptyTableDataView from "@/app/components/UI/EmptyTableDataView";
import GitContribution from "@/app/components/UI/GitContribution";
import IconComponent from "@/app/components/UI/IconComponent";
import MenuComponent from "@/app/components/UI/MenuComponent";
import PageTitle from "@/app/components/UI/PageTitle";
import PerformanceDetails from "@/app/components/UI/PerformanceDetails";
import Threads from "@/app/components/UI/Threads";
import { COLOR_SUBHEADING } from "@/app/utils/colorUtils";
import { BACKEND_URI } from "@/app/utils/constants/constants";
import { IMemberPerformanceIssueHistory } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const MemberPerformanceDetails = (): JSX.Element => {
  const { accountId, date } = useParams<{ accountId: string; date: string }>();
  const [isOpenCommentDialog, setIsOpenCommentDialog] = useState(false);

  const handleCloseCommentDialog = (): void => {
    setIsOpenCommentDialog(false);
  };

  const {
    data,
    isFetching: performanceLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetchMemberPerformanceDetails", accountId, date],
    queryFn: async () => {
      const res: AxiosResponse<IMemberPerformanceIssueHistory> =
        await axios.get(`${BACKEND_URI}/users/issues/${accountId}/${date}`);

      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!accountId && !!date,
  });

  const comments = data?.comments ?? [];

  return (
    <div className="relative adjustedWidthForMenu px-4 md:left-[280px]">
      {/* <MenuComponent currentPage={"members"} /> */}
      <PageTitle pageName="Performance Details" title="6sense Efficiency" />
      <section className="mt-[18px]">
        <div className="mb-2 flex items-center gap-x-2 mr-auto text-base font-medium">
          <Link href={"/member-list?page=1"} className="text-subHeading">
            Members
          </Link>
          <IconComponent
            name={"CaretRight"}
            color={COLOR_SUBHEADING}
            fontSize={14}
          />
          <Link
            href={`/member-list/${accountId}?page=1`}
            className="text-subHeading"
          >
            Information
          </Link>
          <IconComponent
            name={"CaretRight"}
            color={COLOR_SUBHEADING}
            fontSize={14}
          />
          <Link
            href={`/member-list/${accountId}/${date}`}
            className="text-primary"
          >
            Details
          </Link>
        </div>
        {/* <div className='mr-auto text-base text-primary font-medium'>Information</div> */}
        <h3 className="text-headingXS md:text-headingBase font-semibold">
          Performance Details
        </h3>
      </section>
      <section className="mt-8 relative">
        {performanceLoading ? (
          <div className="flex justify-center items-center min-h-[70vh] md:min-h-[75vh]">
            <IconComponent
              data-testid="loading"
              name={"loader"}
              color={"#BA8D46"}
              className="animate-spin"
              fontSize={40}
            />
          </div>
        ) : (
          <>
            <section className="mb-8 flex justify-between items-center">
              <h1 className="font-semibold text-xl">
                Bugs Reported: {data?.noOfBugs ?? 0}
              </h1>
              <div className="flex justify-center md:justify-end">
                <Button
                  prefixIcon="PlusCircle"
                  type="button"
                  className="w-full md:w-[153px]"
                  prefixIconClassName="plusIcon"
                  onClick={() => {
                    setIsOpenCommentDialog(true);
                  }}
                >
                  Add Comment
                </Button>
              </div>
            </section>

            {data?.issues && data.issues.length > 0 ? (
              <>
                <PerformanceDetails date={date} data={data} />
                <div className="mt-8">
                  {/* sending the needRefetch so that i can refetch based on this */}
                  <Threads comments={comments} />
                </div>
              </>
            ) : (
              <EmptyTableDataView
                iconName="FolderPlus"
                heading="No Data Found"
                subHeading=""
              />
            )}
          </>
        )}

        {isOpenCommentDialog && (
          <CommentDialog
            commentAdded={() => {
              refetch();
            }}
            currentDate={`${date}`}
            accountId={`${accountId}`}
            isOpen={isOpenCommentDialog}
            onClose={handleCloseCommentDialog}
          />
        )}

        <GitContribution userId={accountId} date={date} />
      </section>
    </div>
  );
};

export default MemberPerformanceDetails;
