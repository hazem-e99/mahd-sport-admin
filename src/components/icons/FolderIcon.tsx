import type { ImgHTMLAttributes } from "react";
import { memo } from "react";

interface FolderIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  size?: number;
}

const FolderIcon = ({ size = 50, width, height, ...props }: FolderIconProps) => (
  <img
    src="/icons/folder.icon.svg"
    alt="Folder"
    width={width || size}
    height={height || size}
    {...props}
  />
);

const Memo = memo(FolderIcon);
export default Memo;
