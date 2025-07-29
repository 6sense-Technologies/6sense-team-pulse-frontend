import * as React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";

type DropdownProps = {
  className?: string;
  placeholder: string;
  control?: any;
  name: string;
  errors?: any;
  additionalText?: string;
  active?: boolean;
  disabled?: boolean; // <-- Add this line
};

export function ProjectDropdown({
  className,
  placeholder,
  control,
  name,
  errors = {},
  additionalText,
  active = false,
  disabled = false, // <-- Add this line
}: DropdownProps) {
  const renderSelect = (field: any) => (
    <Select {...field} disabled={disabled}>
      <SelectTrigger className={cn("w-[140px] lg:w-[200px] border-none shadow-none", className)} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className={cn("bg-white !z-50 ", className)}>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <div className="relative">
      {control ? <Controller control={control} name={name} render={({ field }) => renderSelect(field)} /> : renderSelect({})}
      {errors[name]?.message ? (
        <p className="absolute mt-1 flex items-center text-sm font-medium text-destructive">{errors[name].message}</p>
      ) : (
        <p className="absolute mt-1 flex items-center text-sm text-inputFooterColor">{additionalText}</p>
      )}
    </div>
  );
}
