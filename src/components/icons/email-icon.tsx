import type { SVGProps } from "react";
import { memo } from "react";
const SvgEmailicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 46 40"
    {...props}
  >
    <path
      fill="#773DBD"
      d="M9.633 12.967 23 21.877l13.367-8.91-1.734-2.6L23 18.123l-11.633-7.757z"
    />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M.604 37.708c0 .863.7 1.563 1.563 1.563h41.666c.863 0 1.563-.7 1.563-1.563V2.292c0-.863-.7-1.563-1.563-1.563H2.167c-.863 0-1.563.7-1.563 1.563zm41.667-1.562H3.729V3.854h38.542z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgEmailicon);
export default Memo;
