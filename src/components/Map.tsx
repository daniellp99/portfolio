import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import { DEFAULT_CENTER } from "@/utils/constants";
import { AvatarMarker } from "./AvatarMarker";
import ZoomHandler from "./ZoomHandler";

export default function Map() {
  return (
    <MapContainer
      attributionControl={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      center={DEFAULT_CENTER}
      zoom={16}
      maxZoom={16}
      className="h-full w-full"
    >
      <ZoomHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <AvatarMarker />
    </MapContainer>
  );
}
