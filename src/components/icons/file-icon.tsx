import type { SVGProps } from "react";
import { memo } from "react";
const SvgFileicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#6B7280"
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    />
    <path fill="#9CA3AF" d="M14 2v6h6" />
  </svg>
);
const Memo = memo(SvgFileicon);
export default Memo;
