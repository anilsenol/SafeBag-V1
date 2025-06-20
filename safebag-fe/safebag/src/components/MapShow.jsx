import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapShow = ({
  shops = [],
  center,
  height = "500px",
  width = "100%",
  zoom = 13,
}) => {
  const containerStyle = {
    width: width,
    height: height,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAy8s4G_5f8YMF3hvBRhU3FlRewXKEx8Sk">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
        {shops.map((shop, index) => (
          <Marker
            key={index}
            position={{ lat: shop.latitude, lng: shop.longitude }}
            title={shop.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapShow;
