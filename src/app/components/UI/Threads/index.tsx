import IconComponent from "@/app/components/UI/IconComponent";
import { COLOR_PRIMARY } from "@/app/utils/colorUtils";

interface IProps {
    needRefetch: boolean
}


const Threads = ({ needRefetch }: IProps): JSX.Element => {
    console.log(needRefetch)
    const comments = [
        { comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum numquam saepe reiciendis omnis ratione esse asperiores, sunt porro vel mollitia!", time: "12:59 PM" },
        { comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum numquam saepe reiciendis omnis ratione esse asperiores, sunt porro vel mollitia!", time: "12:00 PM" },
        { comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum numquam saepe reiciendis omnis ratione esse asperiores, sunt porro vel mollitia!", time: "1:10 PM" },
        { comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum numquam saepe reiciendis omnis ratione esse asperiores, sunt porro vel mollitia!", time: "6:00 PM" },
    ]
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">All Comments</h1>
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
                                        <span className="font-semibold text-xs capitalize rounded-2xl px-2 py-[2px] text-primary bg-primary/10">{comment?.time}</span>
                                        <p className="text-textSecondary mt-1 text-sm">{comment?.comment}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <p>No Comments Found!</p>
                }
            </div>
        </div>
    )
}

export default Threads