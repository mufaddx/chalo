import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 16) {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none" } as const;
}

export function InstagramGlyph({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookGlyph({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path
        d="M14 8.5h2V5.3c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.78-4.92 5.06V13H5.3v3.6h2.83V22h3.6v-5.4h2.72l.43-3.6h-3.15v-2.4c0-1.04.28-1.7 1.77-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XGlyph({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function YoutubeGlyph({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5Z" fill="currentColor" />
    </svg>
  );
}
