import type { SVGProps } from "react";
import { memo } from "react";
const SvgClockicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M10 1.042a8.958 8.958 0 1 0 0 17.917 8.958 8.958 0 0 0 0-17.917m.833 8.613V5.834H9.167v4.512l2.327 2.327 1.179-1.179z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgClockicon);
export default Memo;
