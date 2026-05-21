"use client";

import { useEffect, useRef, useState } from "react";

export function useGridContainerWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (nextWidth: number) => {
      if (nextWidth > 0) {
        setWidth(nextWidth);
        setMounted(true);
      }
    };

    update(el.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) update(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { width, containerRef, mounted };
}
