import { cn } from "@/app/utils/tailwindMerge";

interface IPropTypes {
    customClass?: string;
    hideTwoRow?: boolean;
}

const SkeletonRow = ({ className, widths }: { className: string; widths: string[] }): JSX.Element => {
    return (
        <div className={cn("bg-white grid grid-cols-4 items-center gap-x-10 py-[18px] px-4 border-b-[1px] border-[#F8F9FB]", className)}>
            {widths.map((width, index) => {
                return (
                    <div key={index} className={`max-w-[${width}] bg-[#F5F5F5] rounded-full text-pageBg h-[16px]`}></div>
                )
            })}
        </div>
    );
};

const EmptyTableViewSkeleton = ({ customClass, hideTwoRow }: IPropTypes): JSX.Element => {
    return (
        <div data-testid="skeleton-loader" className={cn("bg-white rounded-lg", customClass)}>
            <div className="bg-[#F8F9FB] grid grid-cols-4 items-center gap-x-10 py-3 px-4 border-b-[1px] border-borderColor">
                {Array(4).fill(null).map((_, index) => {
                    return (
                        <div key={index} className="max-w-[112px] bg-[#E5E5E7] rounded-full text-white h-[16px] animate-pulse"></div>
                    )
                })}
            </div>

            {/* Repeating Skeleton Rows */}
            <SkeletonRow className="" widths={["280px", "145px", "145px", "145px"]} />
            <SkeletonRow className="" widths={["256px", "125px", "125px", "125px"]} />
            <SkeletonRow className="" widths={["280px", "145px", "145px", "145px"]} />
            <SkeletonRow className="" widths={["256px", "125px", "125px", "125px"]} />
            <SkeletonRow className="" widths={["280px", "145px", "145px", "145px"]} />
            <SkeletonRow className="" widths={["256px", "125px", "125px", "125px"]} />
            <SkeletonRow className={cn({ hidden: hideTwoRow })} widths={["280px", "145px", "145px", "145px"]} />
            <SkeletonRow className={cn({ hidden: hideTwoRow })} widths={["256px", "125px", "125px", "125px"]} />
        </div>
    );
};

export default EmptyTableViewSkeleton;
