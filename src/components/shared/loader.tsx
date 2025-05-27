import { Circle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center w-full">
      <Circle size={40} className="animate-spin text-primary" />
    </div>
  );
};

export default Loader;
