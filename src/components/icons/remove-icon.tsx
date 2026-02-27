import type { SVGProps } from "react";
import { memo } from "react";
const SvgRemoveicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path fill="#FF5000" d="M10.667 8.5a.5.5 0 0 0 0-1H5.333a.5.5 0 0 0 0 1z" />
    <path
      fill="#FF5000"
      fillRule="evenodd"
      d="M8 15.167A7.167 7.167 0 1 1 8 .834a7.167 7.167 0 0 1 0 14.333M1.833 8a6.167 6.167 0 1 0 12.334 0A6.167 6.167 0 0 0 1.833 8"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgRemoveicon);
export default Memo;
