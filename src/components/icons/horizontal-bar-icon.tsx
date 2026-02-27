import type { SVGProps } from "react";
import { memo } from "react";
const SvgHorizontalBaricon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 4 20"
    {...props}
  >
    <path fill="#773DBD" d="M0 0h4v20H0z" />
  </svg>
);
const Memo = memo(SvgHorizontalBaricon);
export default Memo;
