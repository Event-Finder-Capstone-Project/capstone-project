import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";

const containerStyle = {
  width: "500px",
  height: "500px",
};

function Maps() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU",
  });

  const [map, setMap] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);
  const [selectedDest, setSelectedDest] = React.useState(null);

  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // const onMapClick = React.useCallback((event) => {
  //   setMarkers((current) => [
  //     ...current,
  //     {
  //       lat: event.latLng.lat(),
  //       lng: event.latLng.lng(),
  //       time: new Date(),
  //     },
  //   ]);
  // }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      defaultCenter={{ lat: latitude, lng: longitude }}
      defaultZoom={2}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components - need to put markers for Events */}
      {markers.map((marker) => (
        <Marker
          key={marker.time.toISOString()}
          position={{ lat: latitude, lng: longitude }}
          onClick={() => {
            setSelectedDest(marker);
          }}
        />
      ))}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Maps);
