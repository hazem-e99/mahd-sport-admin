import type { SVGProps } from "react";
import { memo } from "react";
const SvgEmpActions = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <rect
      width={28.743}
      height={28.743}
      x={0.25}
      y={0.25}
      fill="#fff"
      rx={2.75}
    />
    <rect
      width={28.743}
      height={28.743}
      x={0.25}
      y={0.25}
      stroke="#EAECF0"
      strokeWidth={0.5}
      rx={2.75}
    />
    <path
      fill="#666"
      d="M20.622 10.093 18.15 7.62l-2.471 2.471.943.943.861-.862v3.724h1.334v-3.724l.862.862z"
    />
    <path
      fill="#666"
      d="M8.622 8.288a.667.667 0 0 0-.667.667v12c0 .368.298.666.666.666h12a.667.667 0 0 0 .667-.666V13.62h-1.333v3.67a5 5 0 0 0-1.286-.17 5.2 5.2 0 0 0-2.081.44 8.3 8.3 0 0 1 1.406 2.727h-1.05a7.48 7.48 0 0 0-2.557-3.508 8.22 8.22 0 0 0-5.099-1.658v-5.5h5.333V8.287z"
    />
  </svg>
);
const Memo = memo(SvgEmpActions);
export default Memo;
