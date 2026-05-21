"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <Skeleton className="size-full" />,
});

export default function DeferredMapCard({
  preview,
  children,
}: {
  preview: ReactNode;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="relative size-full overflow-hidden">
      {preview}
      {shouldLoadMap ? <Map>{children}</Map> : null}
    </div>
  );
}
