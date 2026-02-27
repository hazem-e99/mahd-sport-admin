import type { SVGProps } from "react";
import { memo } from "react";
const SvgCaretDownicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 8"
    {...props}
  >
    <path
      fill="#000"
      d="M1.08 7.82h11.84c.96 0 1.44-1.16.76-1.84L8.5.8a2.13 2.13 0 0 0-3.01 0L3.52 2.77.31 5.98c-.67.68-.19 1.84.77 1.84"
    />
  </svg>
);
const Memo = memo(SvgCaretDownicon);
export default Memo;
