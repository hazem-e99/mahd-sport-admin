import type { SVGProps } from "react";
import { memo } from "react";
const SvgUsermultipleicon = (props: SVGProps<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M7.5 1.875a3.958 3.958 0 1 0 0 7.917 3.958 3.958 0 0 0 0-7.917M4.792 5.833a2.708 2.708 0 1 1 5.416 0 2.708 2.708 0 0 1-5.416 0"
      clipRule="evenodd"
    />
    <path
      fill="#773DBD"
      d="M12.5 1.875a.625.625 0 1 0 0 1.25 2.708 2.708 0 1 1 0 5.417.625.625 0 1 0 0 1.25 3.958 3.958 0 0 0 0-7.917"
    />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M1.042 15.833a4.79 4.79 0 0 1 4.791-4.791h3.334a4.79 4.79 0 0 1 4.791 4.791 2.29 2.29 0 0 1-2.291 2.292H3.333a2.29 2.29 0 0 1-2.291-2.292m4.791-3.541a3.54 3.54 0 0 0-3.541 3.541c0 .576.466 1.042 1.041 1.042h8.334c.575 0 1.041-.466 1.041-1.042a3.54 3.54 0 0 0-3.541-3.541z"
      clipRule="evenodd"
    />
    <path
      fill="#773DBD"
      d="M14.167 11.042a.625.625 0 1 0 0 1.25 3.54 3.54 0 0 1 3.541 3.541c0 .576-.466 1.042-1.041 1.042h-1.25a.625.625 0 1 0 0 1.25h1.25a2.29 2.29 0 0 0 2.291-2.292 4.79 4.79 0 0 0-4.791-4.791"
    />
  </svg>
);
const Memo = memo(SvgUsermultipleicon);
export default Memo;
