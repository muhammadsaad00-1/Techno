import React from 'react';
import Map, { Marker } from 'react-map-gl/maplibre'; // ✅ correct
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapboxMap() {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Map
        initialViewState={{
          longitude: 74.3587,
          latitude: 31.5204,
          zoom: 12,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        <Marker longitude={74.3587} latitude={31.5204} color="red" />
      </Map>
    </div>
  );
}
