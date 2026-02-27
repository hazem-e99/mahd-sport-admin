import type { SVGProps } from "react";
import { memo } from "react";
const SvgPlusSign = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 19 19"
    {...props}
  >
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M9.058 9.059V3.62h1.124V9.06h5.438v1.125h-5.437v5.437H9.057v-5.437H3.62V9.059z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgPlusSign);
export default Memo;
