import type { SVGProps } from "react";
import { memo } from "react";
const SvgAddCategory = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 81 80"
    {...props}
  >
    <path
      fill="#773DBD"
      d="M67.167 43.334h-17.5a5.833 5.833 0 0 0-5.834 5.833v17.5a5.833 5.833 0 0 0 5.834 5.833h17.5A5.833 5.833 0 0 0 73 66.667v-17.5a5.833 5.833 0 0 0-5.833-5.834M31.333 43.334h-17.5A5.833 5.833 0 0 0 8 49.167v17.5a5.833 5.833 0 0 0 5.833 5.833h17.5a5.833 5.833 0 0 0 5.834-5.833v-17.5a5.833 5.833 0 0 0-5.834-5.834M31.333 7.5h-17.5A5.833 5.833 0 0 0 8 13.333v17.5a5.833 5.833 0 0 0 5.833 5.834h17.5a5.833 5.833 0 0 0 5.834-5.834v-17.5A5.833 5.833 0 0 0 31.333 7.5"
    />
    <path
      fill="#FF5000"
      d="M70.5 19.167h-9.167V10a2.5 2.5 0 0 0-5 0v9.167h-9.166a2.5 2.5 0 0 0 0 5h9.166v9.166a2.5 2.5 0 1 0 5 0v-9.166H70.5a2.5 2.5 0 1 0 0-5"
    />
  </svg>
);
const Memo = memo(SvgAddCategory);
export default Memo;
