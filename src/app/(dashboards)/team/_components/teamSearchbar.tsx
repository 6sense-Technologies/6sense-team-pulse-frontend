import { Input } from "@/components/ui/input";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type SearchbarProps = {
  placeholder?: string;
  name?: string;
  btntext?: string;
  variant?: "default" | "link" | "submit" | "secondary" | "outline" | "destructive" | "ghost" | "greenish" | "light" | "extralight" | "dark" | null;
  className?: string;
};

const TeamSearchbar: FC<SearchbarProps> = ({ placeholder, name, className }) => {
  return (
    <div className={cn("flex", className)}>
      <Search size={14} className="absolute text-subHeading mt-3 ml-[14px]"/>
      <Input placeholder={placeholder} name={name} className="pl-8"/>
    </div>
  );
};

export default TeamSearchbar;