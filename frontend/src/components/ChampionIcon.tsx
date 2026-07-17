"use client";

import Image from "next/image";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { championIconUrl } from "@/lib/data-dragon";

type Props = {
  championId: string;
  alt: string;
  size: number;
  className?: string;
};

export function ChampionIcon({ championId, alt, size, className }: Props) {
  const { data: version } = useLatestVersion();

  if (!version) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`${className ?? ""} animate-pulse bg-extra/40`}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={championIconUrl(version, championId)}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
