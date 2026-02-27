import type { SVGProps } from "react";
import { memo } from "react";
const SvgPlaySquare = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="#FF003D"
      fillRule="evenodd"
      d="M5 3.75c-.69 0-1.25.56-1.25 1.25v30c0 .69.56 1.25 1.25 1.25h30c.69 0 1.25-.56 1.25-1.25V5c0-.69-.56-1.25-1.25-1.25zm10.417 8.75 12.5 7.5-12.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgPlaySquare);
export default Memo;
