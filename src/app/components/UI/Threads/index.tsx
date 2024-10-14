import EmptyTableDataView from "@/app/components/UI/EmptyTableDataView";
import IconComponent from "@/app/components/UI/IconComponent";
import { COLOR_PRIMARY } from "@/app/utils/colorUtils";

interface IProps {
    comments: {
        comment: string;
        timestamp: string;
    }[]
}


const Threads = ({ comments }: IProps): JSX.Element => {
    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleTimeString('en-US', options);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">All Comments</h1>
            </div>
            <div className="space-y-4 my-4">
                {
                    comments?.length > 0 ? comments?.map((comment, index) => {
                        return (
                            <div key={index}>
                                <div className="flex items-start gap-2 max-w-2xl w-full bg-pageBg p-8 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 p-4 rounded-full border border-primary flex justify-center items-center">
                                        <p>
                                            <IconComponent weight="regular" name="User" color={COLOR_PRIMARY} />
                                        </p>
                                    </div>
                                    <div>
                                        {/* <p className="text-xs">{comment?.time}</p> */}
                                        <span className="font-semibold text-xs capitalize rounded-2xl px-2 py-[2px] text-primary bg-primary/10">{formatTime(comment?.timestamp)}</span>
                                        <p className="text-textSecondary mt-1 text-sm">{comment?.comment}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <EmptyTableDataView iconName="FolderPlus" heading='No comments' subHeading='Get started by creating a new comment.' />
                }
            </div>
        </div>
    )
}

export default Threads