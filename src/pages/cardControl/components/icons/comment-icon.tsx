import type { SVGProps } from "react";
import { memo } from "react";
const SvgCommenticon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="#773DBD"
      d="M5.67 5.876h3.337v-1.25H5.67zM12.343 10.045v-1.25H5.67v1.25z"
    />
    <path
      fill="#773DBD"
      fillRule="evenodd"
      d="M17.958.043H.041v14.548h3.335v2.735c0 .532.618.826 1.032.492l3.99-3.227h9.559zM1.291 13.341V1.293h15.416v12.049h-8.75l-3.33 2.692v-2.692z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgCommenticon);
export default Memo;
