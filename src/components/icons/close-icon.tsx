import type { SVGProps } from "react";
import { memo } from "react";
const SvgCloseicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="#161616"
      fillRule="evenodd"
      d="M.98.98a.5.5 0 0 1 .707 0L6 5.293 10.313.98a.5.5 0 1 1 .708.707L6.708 6l4.313 4.313a.5.5 0 1 1-.708.707L6 6.707 1.687 11.02a.5.5 0 0 1-.707-.707L5.293 6 .98 1.687a.5.5 0 0 1 0-.707"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgCloseicon);
export default Memo;
