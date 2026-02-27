import type { SVGProps } from "react";
import { memo } from "react";
const SvgCalendaricon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.507 10.02H5.833v1.668h1.674zM10.837 10.02H9.163v1.668h1.674zM14.167 10.02h-1.674v1.668h1.674zM7.507 13.354H5.833v1.667h1.674zM10.837 13.354H9.163v1.667h1.674z"
    />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M6.25 2.5V1.25H4.583V2.5H2.5a.625.625 0 0 0-.625.625v14.813c0 .448.364.812.813.812h14.625a.813.813 0 0 0 .812-.812V3.124A.625.625 0 0 0 17.5 2.5h-2.083V1.25H13.75V2.5zM16.5 7.917v9.208h-13V7.917z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgCalendaricon);
export default Memo;
