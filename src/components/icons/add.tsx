import type { SVGProps } from "react";
import { memo } from "react";
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#161616"
      d="M11.25 12.75V20h1.5v-7.25H20v-1.5h-7.25V4h-1.5v7.25H4v1.5z"
    />
  </svg>
);
const Memo = memo(SvgAdd);
export default Memo;
