import type { SVGProps } from "react";

export function ZenEnsoSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-hidden="true" fill="none" {...props}>
      <path
        d="M92.5 28.5C79.7 15.1 55.9 12.7 37.8 23.4C16.7 35.9 11.5 63.2 24.9 82.6C37.8 101.3 65.4 106.4 85.1 94.3C102.8 83.4 108.8 59.7 98.4 42.6"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M96.4 38.7C99.8 43.8 101.1 49.8 100.1 56.2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
