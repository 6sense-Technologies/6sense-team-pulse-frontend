import { Button } from "@/app/components/UI/ButtonComponent"
import ImageComponent from "@/app/components/UI/ImageComponent"
import MemberDetailListView from "@/app/components/UI/MemberDetailListView"
import { cn } from "@/app/utils/tailwindMerge"
import { IMemberDetail } from "@/types/types"

interface IProps {
    data?: IMemberDetail,
    totalCountAndLimit: { totalCount: number, size: number }
}
const MemberDetail = ({ data, totalCountAndLimit }: IProps): JSX.Element => {
    console.log(data);
    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
                <div className={cn("flex flex-col md:flex-row items-start md:gap-2", { "items-center": !data?.emailAddress })}>
                    <ImageComponent
                        src={data?.avatarUrls ?? ""}
                        alt={"Pattern50 Logo"}
                        width="w-[40px]"
                        height="h-[40px]"
                        imageClassName="rounded-full"
                        className="text-left md:mt-1"
                    />
                    <div>
                        <h3 className="text-xl text-textSecondary font-semibold">{data?.displayName}</h3>
                        <p className="text-sm text-subHeading">
                            {data?.emailAddress}
                        </p>
                        {/* <p className=" text-sm text-subHeading">
                            Frontend Engineer
                        </p> */}
                    </div>
                </div>
                <div>
                    <Button prefixIcon="Trash">Archive</Button>
                </div>
            </div>

            <div className="mt-8">
                <MemberDetailListView totalCountAndLimit={totalCountAndLimit} data={data?.issueHistory} accountId={`${data?.accountId}`} />
            </div>
        </div>
    )
}

export default MemberDetail