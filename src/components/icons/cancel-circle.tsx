import type { SVGProps } from "react";
import { memo } from "react";
const SvgCancelCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#FF003D"
      fillRule="evenodd"
      d="M10 18.959a8.958 8.958 0 1 1 0-17.917 8.958 8.958 0 0 1 0 17.917m3.09-10.87a.833.833 0 1 0-1.18-1.178L10 8.821l-1.91-1.91A.833.833 0 0 0 6.91 8.09L8.822 10l-1.91 1.91a.833.833 0 0 0 1.178 1.18L10 11.178l1.912 1.91a.833.833 0 0 0 1.178-1.178l-1.91-1.91z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgCancelCircle);
export default Memo;
