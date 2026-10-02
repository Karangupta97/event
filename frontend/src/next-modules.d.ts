// Ambient module declarations for next/image.
// In Next.js 16 the Image component types are delivered through the global
// image-types reference in next-env.d.ts. Some files in the project hit a
// TS7016 error because that global reference doesn't create a named module.
// This explicit ambient declaration resolves the import for those files.

import type { JSX } from "react";

declare module "next/image" {
  export interface ImageProps {
    src: string | { src: string; height: number; width: number; blurDataURL?: string };
    alt: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    fill?: boolean;
    loader?: (p: { src: string; width: number; quality?: number }) => string;
    quality?: number | `${number}`;
    priority?: boolean;
    placeholder?: "blur" | "empty" | `data:image/${string}`;
    style?: React.CSSProperties;
    onLoadingComplete?: (img: HTMLImageElement) => void;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    loading?: "lazy" | "eager";
    blurDataURL?: string;
    unoptimized?: boolean;
    overrideSrc?: string;
    decoding?: "async" | "auto" | "sync";
    sizes?: string;
    className?: string;
    [key: string]: unknown;
  }

  export default function Image(props: ImageProps): JSX.Element;
}
