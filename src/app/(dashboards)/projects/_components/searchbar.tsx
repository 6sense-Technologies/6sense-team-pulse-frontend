import { Button } from "@/components/ButtonComponent";
import { Input } from "@/components/ui/input";
import React, { FC } from "react";
import { cn } from "@/lib/utils";

type SearchbarProps = {
  placeholder?: string;
  name?: string;
  btntext?: string;
  variant?: "default" | "link" | "submit" | "secondary" | "outline" | "destructive" | "ghost" | "greenish" | "light" | "extralight" | "dark" | null;
  className?: string;
};

const Searchbar: FC<SearchbarProps> = ({ placeholder, name, btntext, variant, className }) => {
  return (
    <div className={cn("flex", className)}>
      <Input placeholder={placeholder} name={name} />
      <Button variant={variant}>{btntext}</Button>
    </div>
  );
};

export default Searchbar;