"use client";

import { useEffect, useRef } from "react";

type Props = {
  onIntersect: () => void;
  disabled?: boolean;
};

/** Invisible marker that fires onIntersect once it scrolls near the
 * viewport -- drives every "load more" list in the app instead of a
 * manual pagination control. */
export function InfiniteScrollSentinel({ onIntersect, disabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Keeps the observer effect below from tearing down and reattaching on
  // every render just because the caller passed a fresh inline callback --
  // it always reads the latest one through the ref instead.
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersectRef.current();
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled]);

  return <div ref={ref} aria-hidden className="h-px" />;
}
