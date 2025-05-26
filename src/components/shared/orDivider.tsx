import { cn } from "@/lib/utils";

interface TOrDividerProps {
  text: string;
  className?: string;
}

const OrDivider = ({ text, className }: TOrDividerProps) => {
  return (
    <div className={cn("mt-4 flex items-center ", className)}>
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 text-gray-500">{text}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default OrDivider;
