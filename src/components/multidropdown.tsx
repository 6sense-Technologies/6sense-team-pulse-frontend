/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ButtonComponent";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiDropdownProps {
  control: any;
  name: string;
  placeholder?: string;
  options: any[];
  additionalText?: string;
  errors?: any;
  message?: any;
  className?: string; // Add className prop
}

export function MultiDropdown({
  control,
  name,
  placeholder,
  options,
  additionalText,
  errors,
  message,
  className, // Destructure className prop
}: MultiDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleRemoveItem = (valueToRemove: string, onChange: (value: string[]) => void) => {
    const newSelectedValues = selectedValues.filter((value) => value !== valueToRemove);
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleSelectItem = (value: string, onChange: (value: string[]) => void) => {
    const newSelectedValues = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        React.useEffect(() => {
          setSelectedValues(field.value || []);
        }, [field.value]);

        return (
          <div className={cn("w-full max-w-[553px] pl-2 lg:pl-0 lg:mt-0 relative", className)}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("w-full justify-between h-auto min-h-[36px] px-2 py-1", className)}
                >
                  <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((value) => (
                        <Badge
                          key={value}
                          variant="secondary"
                          className="bg-white border-lightborderColor rounded-xl text-lightAquaTextColor hover:bg-white cursor-auto"
                        >
                          {options.find((option) => option.value === value)?.label}
                          <span
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(value, field.onChange);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleRemoveItem(value, field.onChange);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                          ></span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-subHeading font-normal pl-1">{placeholder}</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={cn("w-full p-0", className)}>
                <Command>
                  <CommandList>
                    <CommandEmpty className="bg-white z-50">No {placeholder?.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup className="w-[420px] bg-white z-50">
                      {options.map((option) => (
                        <CommandItem key={option.value} onSelect={() => handleSelectItem(option.value, field.onChange)}>
                          <Check className={cn("mr-2 h-4 w-4", selectedValues.includes(option.value) ? "opacity-100" : "opacity-0")} />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors && errors[name]?.message ? (
              <p className="absolute mt-1 flex items-center text-twelve md:text-sm font-medium text-destructive">{errors[name].message}</p>
            ) : message ? null : additionalText ? (
              <p className="absolute mt-1 flex items-center text-twelve md:text-sm text-inputFooterColor min-w-[330px]">{additionalText}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
