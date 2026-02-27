import type { SVGProps } from "react";
import { memo } from "react";
const SvgEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <rect
      width={30.743}
      height={30.743}
      x={0.493}
      y={0.25}
      fill="#fff"
      rx={2.75}
    />
    <rect
      width={30.743}
      height={30.743}
      x={0.493}
      y={0.25}
      stroke="#EAECF0"
      strokeWidth={0.5}
      rx={2.75}
    />
    <path
      fill="#444"
      d="m23.364 12.622-2.602 2.602-4.5-4.5 2.602-2.602zM15.467 11.519l4.5 4.5-7.103 7.103h-4.5v-4.5zM16.615 23.122h6.75v-1.5h-6.75z"
    />
  </svg>
);
const Memo = memo(SvgEdit);
export default Memo;
