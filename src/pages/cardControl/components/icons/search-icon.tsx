import type { SVGProps } from "react";
import { memo } from "react";
const SvgSearchicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 15 15"
    {...props}
  >
    <path
      fill="#5F6368"
      d="M5.964 10.412q-2.091 0-3.536-1.446Q.982 7.519.982 5.434t1.445-3.532Q3.87.456 5.957.455q2.088 0 3.535 1.448 1.447 1.446 1.447 3.533a4.9 4.9 0 0 1-.293 1.683 4.7 4.7 0 0 1-.783 1.4l4.757 4.747q.167.165.17.407.005.24-.174.418a.57.57 0 0 1-.823.002L9.04 9.336q-.62.516-1.425.796a5 5 0 0 1-1.651.28M5.96 9.246q1.6 0 2.706-1.104 1.107-1.106 1.106-2.709 0-1.604-1.106-2.708T5.959 1.621 3.252 2.726 2.148 5.434t1.105 2.708T5.96 9.246"
    />
  </svg>
);
const Memo = memo(SvgSearchicon);
export default Memo;
