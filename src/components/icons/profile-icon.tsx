import type { SVGProps } from "react";
import { memo } from "react";
const SvgProfileicon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M5 6.458h1.667v-1.25H5zM8.333 6.458H15v-1.25H8.333zM5 10.625h1.667v-1.25H5zM8.333 10.625H15v-1.25H8.333zM5 14.792h1.667v-1.25H5zM8.333 14.792H15v-1.25H8.333z"
    />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M2.5 1.875a.625.625 0 0 0-.625.625v15c0 .345.28.625.625.625h15c.345 0 .625-.28.625-.625v-15a.625.625 0 0 0-.625-.625zm.625 15V3.125h13.75v13.75z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgProfileicon);
export default Memo;
