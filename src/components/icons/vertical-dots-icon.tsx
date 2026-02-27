import type { SVGProps } from "react";
import { memo } from "react";
const SvgVerticalDotsicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 4 14"
    {...props}
  >
    <path
      fill="#1B1B1B"
      d="M2 13.226q-.504 0-.86-.356a1.17 1.17 0 0 1-.356-.86q0-.505.356-.861t.86-.356.861.356.356.86-.356.861a1.17 1.17 0 0 1-.86.356m0-5.01q-.504 0-.86-.355A1.17 1.17 0 0 1 .784 7q0-.506.356-.86.356-.356.86-.356.506 0 .861.355.356.355.356.861t-.356.86a1.17 1.17 0 0 1-.86.356m0-5.01q-.504 0-.86-.355a1.17 1.17 0 0 1-.356-.86q0-.505.356-.861T2 .774t.861.356.356.86-.356.861a1.17 1.17 0 0 1-.86.356"
    />
  </svg>
);
const Memo = memo(SvgVerticalDotsicon);
export default Memo;
