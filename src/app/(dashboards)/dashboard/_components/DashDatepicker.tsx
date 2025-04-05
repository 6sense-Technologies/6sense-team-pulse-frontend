"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DashDatePicker() {
    const [date, setDate] = React.useState<Date>()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        "cursor-not-allowed" // Add this for visual feedback
                    )}
                    disabled // Disable the button
                >
                    <CalendarIcon strokeWidth={2} />
                    {date ? format(date, "dd MMM, yyyy") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2 bg-white pointer-events-none" // Disable interaction
            >
                <Select disabled> {/* Disable the Select component */}
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border bg-white">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled // Disable the Calendar component
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}