import type { SVGProps } from "react";
import { memo } from "react";
const SvgRightArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 20"
    {...props}
  >
    <path
      fill="#773DBD"
      d="M10.322 10 6.945 6.623a.56.56 0 0 1-.167-.398.56.56 0 0 1 .167-.413.56.56 0 0 1 .821-.01l3.695 3.694a.8.8 0 0 1 .16.235.7.7 0 0 1 .053.27.68.68 0 0 1-.214.5l-3.693 3.693a.56.56 0 0 1-.413.173.55.55 0 0 1-.41-.179.57.57 0 0 1-.17-.408.55.55 0 0 1 .171-.403z"
    />
  </svg>
);
const Memo = memo(SvgRightArrow);
export default Memo;
