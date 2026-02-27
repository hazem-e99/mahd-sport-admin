import type { SVGProps } from "react";
import { memo } from "react";
const SvgAwarnessConfig = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <rect width={30} height={30} fill="#773DBD" rx={3} />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M13.625 12.219a1.406 1.406 0 1 0 0 2.812 1.406 1.406 0 0 0 0-2.812m-.469 1.406a.469.469 0 1 1 .938 0 .469.469 0 0 1-.938 0"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M10.031 10.969V20.5c0 .259.21.469.469.469h9.531v.781h.938v-.781h.781v-.938h-.781V10.5a.47.47 0 0 0-.469-.469h-9.531V9.25h-.938v.781H9.25v.938zm.938 0v9.062h.595l5.443-5.122 3.024 1.925v-5.865zm9.062 9.062h-7.099l4.187-3.94 2.912 1.854z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgAwarnessConfig);
export default Memo;
