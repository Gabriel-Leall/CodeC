import type { SVGProps } from "react";

export function SumiDividerSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 360 28" role="img" aria-hidden="true" fill="none" {...props}>
      <path
        d="M6 14.5C35.5 9.4 67.5 16.6 96.4 12.3C132.2 7 164.2 10.8 198.5 14.5C245.1 19.6 284.4 7.4 354 13.6"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M40 17.4C95.8 20.8 138.5 11.5 194.4 15.7C239.5 19.1 281.5 16.9 322.5 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function HankoMarkSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true" fill="none" {...props}>
      <path
        d="M11 10.5C20.2 9.4 43.8 10.8 53 10.2C52.2 22.6 54.2 40.5 52.4 53.1C39.9 51.8 22.4 54.2 10.8 52.5C12.2 40.2 9.4 22.7 11 10.5Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 20H43M32 20V44M22 32H42M24 44C27.5 40.2 28.8 36.1 29.8 32M40.5 44C37.2 39.8 35.8 36.1 34.8 32"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
