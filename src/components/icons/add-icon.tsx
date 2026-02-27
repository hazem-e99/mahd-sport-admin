import type { SVGProps } from "react";
import { memo } from "react";
const SvgAddicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#161616"
      d="M8.5 5.334a.5.5 0 1 0-1 0V7.5H5.333a.5.5 0 0 0 0 1H7.5v2.167a.5.5 0 1 0 1 0V8.5h2.167a.5.5 0 0 0 0-1H8.5z"
    />
    <path
      fill="#161616"
      fillRule="evenodd"
      d="M8 15.167A7.167 7.167 0 1 1 8 .834a7.167 7.167 0 0 1 0 14.333M1.833 8a6.167 6.167 0 1 0 12.334 0A6.167 6.167 0 0 0 1.833 8"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgAddicon);
export default Memo;
