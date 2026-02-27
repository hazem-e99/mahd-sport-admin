import type { ImgHTMLAttributes } from "react";
import { memo } from "react";

interface FileIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  size?: number;
}

const FileIcon = ({ size = 50, width, height, ...props }: FileIconProps) => (
  <img
    src="/icons/file.icon.svg"
    alt="File"
    width={width || size}
    height={height || size}
    {...props}
  />
);

const Memo = memo(FileIcon);
export default Memo;
