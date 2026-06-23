"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Activity } from "react";

const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  {
    ssr: false,
  },
);

export default function MapTiles() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Activity mode={resolvedTheme === "dark" ? "visible" : "hidden"}>
        <TileLayer
          url={"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
        />
      </Activity>
      <Activity mode={resolvedTheme === "dark" ? "hidden" : "visible"}>
        <TileLayer
          url={"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        />
      </Activity>
    </>
  );
}
