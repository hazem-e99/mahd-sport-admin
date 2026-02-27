import type { SVGProps } from "react";
import { memo } from "react";
const SvgDeleteicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2em"
    height="2em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <rect
      width={30.743}
      height={30.743}
      x={0.25}
      y={0.25}
      fill="#fff"
      rx={2.75}
    />
    <rect
      width={30.743}
      height={30.743}
      x={0.25}
      y={0.25}
      stroke="#EAECF0"
      strokeWidth={0.5}
      rx={2.75}
    />
    <path
      fill="#FE3A46"
      fillRule="evenodd"
      d="M13.747 7.56a.75.75 0 0 0-.69.454l-.93 2.17H8.122v1.5H9.49l.695 11.472a.563.563 0 0 0 .562.528h9.75a.563.563 0 0 0 .561-.528l.696-11.472h1.368v-1.5h-4.006l-.93-2.17a.75.75 0 0 0-.69-.455zm3.737 2.624H13.76l.482-1.125h2.761zm-2.987 4.688v4.5h-1.5v-4.5zm3.75 0v4.5h-1.5v-4.5z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgDeleteicon);
export default Memo;
