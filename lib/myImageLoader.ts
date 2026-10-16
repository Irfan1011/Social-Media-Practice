"use client";

type CloudinaryLoaderProps = {
  src: string;
  width: string;
  quality?: string;
};

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps) {
  const params = `w_${width},q_${quality ?? "auto"},f_auto`;

  return src.replace("/upload", `/upload/${params}`);
}
