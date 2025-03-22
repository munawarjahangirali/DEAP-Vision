'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';
import { useCommon } from '@/context/CommonContext';
// Fix Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// Helper component for map panning
const FlyToLocation = ({ center, zoom }:any) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};
const DMap = () => {
  const { sites } = useCommon();
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [zoomLevel, setZoomLevel] = useState<number>(2);
  const handleMarkerClick = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude]);
    setZoomLevel(10); // Adjust zoom level as needed
  };
  const createCustomIcon = (violationCount: number) => {
    return L.divIcon({
      html: `<div class="country-color">${violationCount}</div>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <FlyToLocation center={mapCenter} zoom={zoomLevel} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {sites.map((site: any) => (
          <Marker
            key={site.id}
            position={[site.latitude, site.longitude]}
            icon={createCustomIcon(site.violationCount)}
            eventHandlers={{
              click: () => handleMarkerClick(site.latitude, site.longitude),
            }}
          >
            <Popup>
              <strong>{site.name}</strong>
              <br />
              Violations: {site.violationCount}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style jsx>{`
        .leaflet-control-zoom {
          display: none;
        }
      `}</style>
    </div>
  );
};
export default DMap;







