import type { SVGProps } from "react";
import { memo } from "react";
const SvgUsericon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.792 1.041a4.375 4.375 0 1 0 0 8.75 4.375 4.375 0 0 0 0-8.75M14.98 12.564a19 19 0 0 1-.35-.2 9.51 9.51 0 0 0-9.676 0 19 19 0 0 1-.353.201c-.594.335-1.491.842-2.107 1.444-.384.377-.75.873-.816 1.481-.071.647.211 1.253.777 1.792.976.93 2.148 1.676 3.663 1.676h7.348c1.516 0 2.687-.746 3.663-1.676.566-.539.848-1.145.778-1.792-.067-.608-.432-1.104-.817-1.48-.615-.603-1.513-1.11-2.107-1.444z"
    />
  </svg>
);
const Memo = memo(SvgUsericon);
export default Memo;
