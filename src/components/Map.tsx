import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import ZoomHandler from "./ZoomHandler";

export default function Map() {
  return (
    <MapContainer
      attributionControl={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      center={[20.89689, -76.26652]}
      zoom={16}
      maxZoom={16}
      className="h-full w-full rounded-lg"
    >
      <ZoomHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[20.89689, -76.26652]}>
        <Popup>He</Popup>
      </Marker>
    </MapContainer>
  );
}
