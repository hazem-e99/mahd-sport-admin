import type { SVGProps } from "react";
import { memo } from "react";
const SvgBackicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 11"
    {...props}
  >
    <path
      fill="#1B1B1B"
      d="m2.545 6.023 3.832 3.831a.52.52 0 0 1 .158.373q0 .21-.16.372a.52.52 0 0 1-.375.164.5.5 0 0 1-.37-.164L.98 5.95a.6.6 0 0 1-.146-.207.6.6 0 0 1-.046-.242.6.6 0 0 1 .046-.242.7.7 0 0 1 .146-.212L5.63.397a.51.51 0 0 1 .365-.156.52.52 0 0 1 .38.156q.16.165.16.375t-.16.376l-3.83 3.825h8.406q.214 0 .369.155a.5.5 0 0 1 .153.372q0 .22-.153.37a.5.5 0 0 1-.37.153z"
    />
  </svg>
);
const Memo = memo(SvgBackicon);
export default Memo;
