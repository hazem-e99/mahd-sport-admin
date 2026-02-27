import type { SVGProps } from "react";
import { memo } from "react";
const SvgDeletecicon = (props: SVGProps<SVGSVGElement>) => (
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
      x={0.25}
      y={0.628}
      fill="#fff"
      rx={2.75}
    />
    <rect
      width={30.743}
      height={30.743}
      x={0.25}
      y={0.628}
      stroke="#EAECF0"
      strokeWidth={0.5}
      rx={2.75}
    />
    <path
      fill="#FE3A46"
      fillRule="evenodd"
      d="M13.747 7.938a.75.75 0 0 0-.69.454l-.93 2.17H8.122v1.5H9.49l.695 11.472a.563.563 0 0 0 .562.529h9.75a.56.56 0 0 0 .561-.529l.696-11.471h1.368v-1.5h-4.006l-.93-2.17a.75.75 0 0 0-.69-.456zm3.737 2.625H13.76l.482-1.126h2.761zm-2.987 4.687v4.5h-1.5v-4.5zm3.75 0v4.5h-1.5v-4.5z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgDeletecicon);
export default Memo;
