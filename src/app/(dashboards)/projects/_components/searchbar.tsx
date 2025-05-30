// import { Input } from "@/components/ui/input";
// import React, { FC } from "react";
// import { cn } from "@/lib/utils";
// import { Search } from "lucide-react";

// type SearchbarProps = {
//   placeholder?: string;
//   name?: string;
//   btntext?: string;
//   variant?: "default" | "link" | "submit" | "secondary" | "outline" | "destructive" | "ghost" | "greenish" | "light" | "extralight" | "dark" | null;
//   className?: string;
//   disabled?: boolean;
// };

// const Searchbar: FC<SearchbarProps> = ({ placeholder, name, className, disabled = true }) => {
//   return (
//     <div className={cn("flex", className)}>
//       <Search size={14} className="absolute text-subHeading mt-3 ml-[14px]" />
//       <Input placeholder={placeholder} name={name} className="pl-8" disabled={disabled} />
//     </div>
//   );
// };

// export default Searchbar;

import { Input } from "@/components/ui/input";
import React, { FC, FormEvent, ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type SearchbarProps = {
  placeholder?: string;
  name?: string;
  btntext?: string;
  variant?: "default" | "link" | "submit" | "secondary" | "outline" | "destructive" | "ghost" | "greenish" | "light" | "extralight" | "dark" | null;
  className?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
};

const Searchbar: FC<SearchbarProps> = ({ placeholder, name, className, disabled = false, value = "", onChange, onSubmit }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(inputValue);
  };

  return (
    <form className={cn("flex relative", className)} onSubmit={handleSubmit}>
      <Search size={14} className="absolute text-subHeading mt-3 ml-[14px]" />
      <Input placeholder={placeholder} name={name} className="pl-8" disabled={disabled} value={value} onChange={handleChange} />
      {/* Optionally add a submit button if btntext is provided */}
      {/* <Button type="submit" className="ml-2" variant={variant || "default"}>
        {btntext || "Search"}
      </Button> */}
    </form>
  );
};

export default Searchbar;
