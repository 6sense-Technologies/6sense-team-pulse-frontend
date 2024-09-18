import { cn } from "@/app/utils/tailwindMerge"

interface IPropTypes {
    customClass?: string
    hideTwoRow?: boolean
}

const EmptyTableViewSkeleton = ({ customClass, hideTwoRow }: IPropTypes): JSX.Element => {
    return (
        <div className={cn("bg-white rounded-lg", customClass)}>
            <div className="bg-[#F8F9FB] grid grid-cols-4 items-center gap-x-10 py-3 px-4 border-b-[1px] border-borderColor">
                <div className="max-w-[112px] bg-[#E5E5E7] rounded-full text-white h-[16px] animate-pulse"></div>
                <div className="max-w-[112px] bg-[#E5E5E7] rounded-full text-white h-[16px] animate-pulse"></div>
                <div className="max-w-[112px] bg-[#E5E5E7] rounded-full text-white h-[16px] animate-pulse"></div>
                <div className="max-w-[112px] bg-[#E5E5E7] rounded-full text-white h-[16px] animate-pulse"></div>
            </div>
            {/* repeating pattern */}
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[280px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[256px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[280px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[256px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[280px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[256px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[280px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className="bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]">
                <div className="max-w-[256px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className={cn("bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]", { "hidden": hideTwoRow })}>
                <div className="max-w-[280px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[145px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
            <div className={cn("bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]", { "hidden": hideTwoRow })}>
                <div className="max-w-[256px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
                <div className="max-w-[125px] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]"></div>
            </div>
        </div>
    )
}

export default EmptyTableViewSkeleton