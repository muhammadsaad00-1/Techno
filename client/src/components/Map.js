import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function MapboxMap({ onLocationSelect }) {
  const [viewport, setViewport] = useState(null); // start with null to indicate loading
  const [marker, setMarker] = useState(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setViewport({
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            zoom: 12,
          });
        },
        () => {
          // fallback to default location if geolocation fails
          setViewport({
            longitude: 74.3587,
            latitude: 31.5204,
            zoom: 12,
          });
        }
      );
    } else {
      // fallback if geolocation not supported
      setViewport({
        longitude: 74.3587,
        latitude: 31.5204,
        zoom: 12,
      });
    }
  }, []);

  const handleMapMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = 'triggered';
    }, 600);
  };

  const handleMapMouseUp = async (event) => {
    if (longPressTimer.current === 'triggered') {
      const { lngLat } = event;
      const { lng, lat } = lngLat;

      setMarker({ longitude: lng, latitude: lat });

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        const address = data.display_name || 'Unknown location';

        // Call parent callback
        if (onLocationSelect) {
          onLocationSelect({ latitude: lat, longitude: lng, address });
        }
      } catch (error) {
        if (onLocationSelect) {
          onLocationSelect({ latitude: lat, longitude: lng, address: 'Unknown location' });
        }
      }
    }
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  if (!viewport) {
    return (
      <Box
        sx={{
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Map
        initialViewState={viewport}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
        onMouseDown={handleMapMouseDown}
        onMouseUp={handleMapMouseUp}
        onTouchStart={handleMapMouseDown}
        onTouchEnd={handleMapMouseUp}
      >
        {marker && <Marker longitude={marker.longitude} latitude={marker.latitude} color="red" />}
      </Map>
    </div>
  );
}
