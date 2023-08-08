import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { Container } from "react-bootstrap";

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
    libraries:['places'],
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

  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: latitude, lng: longitude }}
      zoom={10}
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
  );
}

export default React.memo(Maps);
