import type { SVGProps } from "react";
import { memo } from "react";
const SvgPinicon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 10 15"
    {...props}
  >
    <path
      fill="#FF5000"
      d="M7.481 1.55v5.643l1.636 1.625a.7.7 0 0 1 .108.152.4.4 0 0 1 .046.201v.285q0 .204-.15.356a.48.48 0 0 1-.355.153H5.5v4.13a.49.49 0 0 1-.147.354.48.48 0 0 1-.351.147.48.48 0 0 1-.354-.147.48.48 0 0 1-.148-.354v-4.13H1.236a.49.49 0 0 1-.36-.153.5.5 0 0 1-.15-.356v-.285q0-.114.047-.201a.7.7 0 0 1 .112-.152l1.632-1.625V1.55h-.499a.49.49 0 0 1-.354-.146.48.48 0 0 1-.147-.349q0-.203.147-.354t.354-.15h5.966a.48.48 0 0 1 .35.147.49.49 0 0 1 0 .703.47.47 0 0 1-.35.15zm-5.34 7.416h5.716L6.482 7.61V1.55H3.516v6.058z"
    />
  </svg>
);
const Memo = memo(SvgPinicon);
export default Memo;
