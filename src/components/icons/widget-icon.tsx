import type { SVGProps } from "react";
import { memo } from "react";
const SvgWidgeticon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 46 46"
    {...props}
  >
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M2.167.604c-.863 0-1.563.7-1.563 1.563v16.666c0 .863.7 1.563 1.563 1.563h16.666c.863 0 1.563-.7 1.563-1.563V2.167c0-.863-.7-1.563-1.563-1.563zm1.562 16.667V3.729h13.542v13.542z"
      clipRule="evenodd"
    />
    <path
      fill="#773DBD"
      d="M33.938 1.125v7.813h-7.813v3.125h7.813v7.812h3.124v-7.812h7.813V8.938h-7.812V1.125z"
    />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M.604 27.167c0-.863.7-1.563 1.563-1.563h16.666c.863 0 1.563.7 1.563 1.563v16.666c0 .863-.7 1.563-1.563 1.563H2.167c-.863 0-1.563-.7-1.563-1.563zm3.125 1.562v13.542h13.542V28.729zM27.167 25.604c-.863 0-1.563.7-1.563 1.563v16.666c0 .863.7 1.563 1.563 1.563h16.666c.863 0 1.563-.7 1.563-1.563V27.167c0-.863-.7-1.563-1.563-1.563zm1.562 16.667V28.729h13.542v13.542z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgWidgeticon);
export default Memo;
