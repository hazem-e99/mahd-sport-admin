import type { SVGProps } from "react";
import { memo } from "react";
const SvgAddFoldericon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#FFB84D"
      d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2"
    />
    <path fill="#FFF" d="M12 9v2h-2v2h2v2h2v-2h2v-2h-2V9z" />
  </svg>
);
const Memo = memo(SvgAddFoldericon);
export default Memo;
