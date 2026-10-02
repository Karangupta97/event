// next/image ambient declaration.
// Resolves TS7016 for files that import from 'next/image' directly.
// The Image component's full prop types are available via the global
// image-types reference in next-env.d.ts; this declaration bridges
// the module resolution gap for TypeScript's type checker.
declare module "next/image" {
  import type { JSX } from "react";

  export interface ImageProps {
    src: string | { src: string; height: number; width: number; blurDataURL?: string };
    alt: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    fill?: boolean;
    quality?: number | `${number}`;
    priority?: boolean;
    placeholder?: "blur" | "empty" | `data:image/${string}`;
    style?: React.CSSProperties;
    className?: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    loading?: "lazy" | "eager";
    blurDataURL?: string;
    unoptimized?: boolean;
    sizes?: string;
    decoding?: "async" | "auto" | "sync";
    [key: string]: unknown;
  }

  export default function Image(props: ImageProps): JSX.Element;
}
