'use client'
import IconComponent from "@/app/components/UI/IconComponent"
import { cn } from "@/app/utils/tailwindMerge"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"


const buttonVariants = cva(
    `flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:bg-disabledBg disabled:text-black`,
    {
        variants: {
            variant: {
                default: "text-white bg-primary hover:opacity-90",
                secondary: "text-black bg-secondary hover:bg-secondaryHover",
                outline: "text-black bg-transparent border-[1px] border-borderColor hover:bg-outlineHover focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-2",
                destructive: "text-white bg-destructive hover:bg-destructiveHover",
                ghost: "text-textPrimary bg-transparent hover:bg-disabled focus:bg-disabled focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-2",
                link: "text-black h-fit w-fit hover:underline underline-offset-4 hover:underline focus:outline focus:outline-2 focus:outline-primary ",
            },
            size: {
                md: "text-sm px-5 h-9",
                xs: "text-sm px-3 h-7",
                sm: "text-sm px-5 h-9",
                lg: "text-lg px-[18px] h-9",
                xl: "text-lg px-5 h-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
)

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    loaderColor?: string
    prefixIcon?: 'Bug' | 'ChatCircleText' | 'loader' | 'PlusCircle' | 'PencilSimpleLine' | 'MinusCircle' | 'TrashSimple' | 'CheckCircle' | 'ArrowClockwise' | 'UserCirclePlus' | 'Copy' | 'ArrowCounterClockwise' | 'GearSix' | 'ArrowSquareOut' | 'UploadSimple' | 'CaretLeft' | 'CaretRight' | 'ChatCenteredDots' | 'ClockCounterClockwise' | 'close' | 'List' | 'PaperPlaneRight' | 'Check' | 'Trash'
    prefixIconColor?: string
    suffixIcon?: 'ArrowBendUpRight'
    suffixIconColor?: string
    buttonDivClassName?: string
    prefixIconClassName?: string
    prefixIconSize?: number
    suffixIconSize?: number
    suffixIconClassName?: string
    weight?: "bold" | "thin" | "light" | "regular" | "fill" | "duotone" | undefined
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
    ({ className, variant, size, weight, loading, loaderColor, prefixIcon, prefixIconColor, prefixIconClassName, prefixIconSize, suffixIcon, suffixIconColor, suffixIconClassName, suffixIconSize, buttonDivClassName, children, ...props }, ref) => {
        return (
            <div className={cn("relative", { "cursor-not-allowed": props?.disabled }, (buttonDivClassName ?? ''))}>

                <button
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    {...props}
                >
                    {
                        loading ? <IconComponent name={'loader'} color={loaderColor ?? '#ffffff'} className='absolute animate-spin' fontSize={16} /> :
                            <div className='flex gap-x-2 items-center'>
                                {
                                    prefixIcon ?
                                        <IconComponent name={prefixIcon} color={prefixIconColor ?? '#fff'} className={prefixIconClassName} fontSize={prefixIconSize} weight={weight} /> : null
                                }
                                {children}
                                {
                                    suffixIcon ?
                                        <IconComponent name={suffixIcon} color={suffixIconColor ?? '#fff'} className={suffixIconClassName} fontSize={suffixIconSize} /> : null
                                }
                            </div>
                    }
                </button>
            </div>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }

