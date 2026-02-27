import type { SVGProps } from "react";
import { memo } from "react";
const SvgSend = (props: SVGProps<SVGSVGElement>) => (
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
      d="M2.917 16.041V3.958L17.26 10zm1.25-1.875L14.042 10 4.167 5.833V8.91L8.686 10l-4.52 1.09z"
    />
  </svg>
);
const Memo = memo(SvgSend);
export default Memo;
