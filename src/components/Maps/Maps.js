import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";

const containerStyle = {
  width: "500px",
  height: "500px",
};

function Maps() {
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);
  const events = useSelector(selectEvents);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU",
  });

  const [map, setMap] = React.useState(null);
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
  if (latitude !== 0 && longitude !== 0) {
    return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        defaultCenter={{ lat: latitude, lng: longitude }}
        defaultZoom={1}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components - need to put markers for Events */}

        {events.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lat: marker.venue.location.lat,
              lng: marker.venue.location.lon,
            }}
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
}

export default React.memo(Maps);
