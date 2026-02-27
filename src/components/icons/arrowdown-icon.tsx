import type { SVGProps } from "react";
import { memo } from "react";
const SvgArrowdownicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#A5A5A5"
      d="M7.935 9.958a.347.347 0 0 0 .502 0l1.988-1.989q.164-.165.08-.387a.32.32 0 0 0-.325-.221H6.187a.32.32 0 0 0-.321.221.34.34 0 0 0 .08.387zm.252 5.79a7.5 7.5 0 0 1-3.022-.61 7.8 7.8 0 0 1-2.462-1.658 7.8 7.8 0 0 1-1.656-2.46 7.5 7.5 0 0 1-.61-3.018q0-1.607.61-3.022a7.8 7.8 0 0 1 1.66-2.462A7.8 7.8 0 0 1 5.165.862a7.5 7.5 0 0 1 3.017-.61q1.608 0 3.023.61 1.414.611 2.461 1.66a7.8 7.8 0 0 1 1.657 2.458 7.5 7.5 0 0 1 .61 3.018 7.5 7.5 0 0 1-.611 3.023 7.8 7.8 0 0 1-1.658 2.461 7.8 7.8 0 0 1-2.46 1.657 7.5 7.5 0 0 1-3.018.61"
    />
  </svg>
);
const Memo = memo(SvgArrowdownicon);
export default Memo;
