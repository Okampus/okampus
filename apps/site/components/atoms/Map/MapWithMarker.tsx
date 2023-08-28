'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

type MapWithMarkerProps = {
  className?: string;
  center: [number, number];
  markerContent: React.ReactNode;
  initMarkerOpened?: boolean;
  zoom?: number;
};
export default function MapWithMarker({
  className,
  center,
  markerContent,
  initMarkerOpened,
  zoom = 13,
}: MapWithMarkerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initMarker = (ref: any) => {
    if (ref && initMarkerOpened) ref.leafletElement?.openPopup();
  };

  return (
    isMounted && (
      <MapContainer className={clsx(className, '!z-20')} center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker ref={initMarker} position={center}>
          <Popup>{markerContent}</Popup>
        </Marker>
      </MapContainer>
    )
  );
}
