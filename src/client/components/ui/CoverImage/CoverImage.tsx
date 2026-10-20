/* eslint-disable @next/next/no-img-element */
import { ImageOff } from "lucide-react";
import { cn } from "@/shared/utils";

type CoverImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  eager?: boolean;
};

/**
 * Foto konten (cover/panorama) berasal dari URL bebas yang diisi admin,
 * sehingga memakai <img> biasa agar tidak terikat daftar host next/image.
 */
export default function CoverImage({
  src,
  alt,
  className,
  imgClassName,
  width,
  height,
  eager = false,
}: CoverImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-brand-100 text-slate-400",
          className,
        )}
        role="img"
        aria-label={`${alt} — gambar belum tersedia`}
      >
        <ImageOff className="h-8 w-8" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", imgClassName, className)}
    />
  );
}
