import type { SVGProps } from "react";
import { memo } from "react";
const SvgOperationalCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <rect width={30} height={30} fill="#773DBD" rx={3} />
    <path
      fill="#fff"
      d="M13.63 15.813h-1.255v1.25h1.256zM16.128 15.813h-1.256v1.25h1.256zM18.625 15.813h-1.256v1.25h1.256zM13.63 18.313h-1.255v1.25h1.256zM16.128 18.313h-1.256v1.25h1.256z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M11.594 9.25v.781H9.875a.47.47 0 0 0-.469.469v11.25c0 .259.21.469.469.469h11.25c.259 0 .469-.21.469-.469V10.5a.47.47 0 0 0-.469-.469h-1.719V9.25h-.937v.781H12.53V9.25zm9.062 3.906V10.97h-1.25v.781h-.937v-.781H12.53v.781h-.937v-.781h-1.25v2.187zm-10.312.938h10.312v7.187H10.344z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgOperationalCalendar);
export default Memo;
