import { cn } from "@/app/utils/tailwindMerge";
import Image from "next/image";

interface IPropTypes {
  src: string;
  alt: string;
  width: string;
  height: string;
  className?: string;
  imageClassName?: string;
}

const ImageComponent = ({ src, alt, width, height, className, imageClassName }: IPropTypes): JSX.Element => {
  return (
    <div className={cn("relative ", `${height} ${width} ${className}`)}>
      <Image style={{ overflow: "hidden", fontSize: "10px" }} fill src={src} alt={alt} className={imageClassName} onError={(err) => {}} />
    </div>
  );
};

export default ImageComponent;
