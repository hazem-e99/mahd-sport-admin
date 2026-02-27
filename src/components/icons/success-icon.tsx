import type { SVGProps } from "react";
import { memo } from "react";
const SvgSuccessicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="#079455"
      fillOpacity={0.1}
      d="M0 20C0 8.954 8.954 0 20 0s20 8.954 20 20-8.954 20-20 20S0 31.046 0 20"
    />
    <path
      fill="#079455"
      d="M23.794 17.922a.625.625 0 0 0-.922-.844l-4.142 4.518-1.622-1.621a.625.625 0 1 0-.883.883l2.083 2.084a.625.625 0 0 0 .903-.02z"
    />
    <path
      fill="#079455"
      fillRule="evenodd"
      d="M20 28.958a8.958 8.958 0 1 1 0-17.917 8.958 8.958 0 0 1 0 17.917M12.29 20a7.708 7.708 0 1 0 15.417 0 7.708 7.708 0 0 0-15.416 0"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgSuccessicon);
export default Memo;
