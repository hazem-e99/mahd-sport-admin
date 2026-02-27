import type { SVGProps } from "react";
import { memo } from "react";
const SvgLeftControlIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 17 17"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="m10.5 12.5-4-4 4-4"
    />
  </svg>
);
const Memo = memo(SvgLeftControlIcon);
export default Memo;
