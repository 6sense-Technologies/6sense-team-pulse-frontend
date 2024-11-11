import IconComponent from "@/app/components/UI/IconComponent"
import { COLOR_EMPTY_TABLE_ICON_COLOR } from "@/app/utils/colorUtils"
import { cn } from "@/app/utils/tailwindMerge"

interface IPropTypes {
    iconName?: 'FolderPlus' | 'FileDoc' | 'Users' | 'ChatsCircle' | 'Files' | 'GithubLogo'
    iconSize?: number
    iconColor?: string
    heading: string
    subHeading: string
    className?: string
}

const EmptyTableDataView = ({ heading, subHeading, iconName, className }: IPropTypes): JSX.Element => {
    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[30vh]", className)}>
            <IconComponent name={iconName ?? 'FolderPlus'} color={COLOR_EMPTY_TABLE_ICON_COLOR} weight='regular' />
            <div className='text-textSecondary text-sm font-semibold mt-1'>{heading}</div>
            <div className='text-emptyTableIconColor text-xl mt-1'>{subHeading}</div>
        </div>
    )
}

export default EmptyTableDataView;