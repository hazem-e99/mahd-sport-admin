import type { SVGProps } from "react";
import { memo } from "react";
const SvgUsercardicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M9 .041a4.375 4.375 0 1 0 0 8.75 4.375 4.375 0 0 0 0-8.75M5.875 4.416a3.125 3.125 0 1 1 6.25 0 3.125 3.125 0 0 1-6.25 0M9 10.041c-4.416 0-8.125 3.197-8.125 7.292v.625h16.25v-.625c0-4.095-3.709-7.292-8.125-7.292m0 1.25c3.619 0 6.484 2.426 6.838 5.417H2.162C2.516 13.718 5.38 11.29 9 11.29"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgUsercardicon);
export default Memo;
