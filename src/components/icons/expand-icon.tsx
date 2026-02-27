import type { SVGProps } from "react";
import { memo } from "react";
const SvgExpandicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 13 13"
    {...props}
  >
    <path
      fill="#444"
      d="M10.592 11.484.756 1.659a.6.6 0 0 1-.187-.446q0-.262.199-.457A.61.61 0 0 1 1.21.561q.25 0 .449.195l9.83 9.824V4.79q0-.268.19-.453a.62.62 0 0 1 .454-.187q.263 0 .451.187a.61.61 0 0 1 .188.452v7.193a.76.76 0 0 1-.229.555.75.75 0 0 1-.55.229H4.8a.62.62 0 0 1-.455-.188.62.62 0 0 1-.189-.456q0-.267.189-.452a.62.62 0 0 1 .455-.186z"
    />
  </svg>
);
const Memo = memo(SvgExpandicon);
export default Memo;
