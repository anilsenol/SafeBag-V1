import React, { useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 41.0082,
  lng: 28.9784,
};

const MapPicker = ({ selectedLat, selectedLng, onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAy8s4G_5f8YMF3hvBRhU3FlRewXKEx8Sk",
  });

  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    onLocationSelect(lat, lng);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        selectedLat && selectedLng
          ? { lat: selectedLat, lng: selectedLng }
          : center
      }
      zoom={10}
      onLoad={onLoad}
      onClick={handleClick}
    >
      {selectedLat && selectedLng && (
        <Marker position={{ lat: selectedLat, lng: selectedLng }} />
      )}
    </GoogleMap>
  ) : (
    <div>Maps Loading</div>
  );
};

export default MapPicker;
