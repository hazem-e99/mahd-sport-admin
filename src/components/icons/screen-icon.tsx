import type { SVGProps } from "react";
import { memo } from "react";
const SvgScreenicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 46 44"
    {...props}
  >
    <path fill="#773DBD" d="M19.875 28.771h6.25v-3.125h-6.25z" />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M2.167.646c-.863 0-1.563.7-1.563 1.563v31.25c0 .862.7 1.562 1.563 1.562H17.27v5.208h-4.688v3.125h20.834V40.23h-4.688v-5.208h15.104c.863 0 1.563-.7 1.563-1.562V2.209c0-.863-.7-1.563-1.563-1.563zm23.437 39.583v-5.208h-5.208v5.208zM3.73 31.896V3.771h38.542v28.125z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgScreenicon);
export default Memo;
