import type { ImgHTMLAttributes } from "react";
import { memo } from "react";

interface AddFolderIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  size?: number;
}

const AddFolderIcon = ({ size = 16, width, height, ...props }: AddFolderIconProps) => (
  <img
    src="/icons/add-folder.icon.svg"
    alt="Add Folder"
    width={width || size}
    height={height || size}
    {...props}
  />
);

const Memo = memo(AddFolderIcon);
export default Memo;
