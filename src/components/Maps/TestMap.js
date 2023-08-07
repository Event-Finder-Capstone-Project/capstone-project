import React, { useEffect, useState, useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";

export default function TestMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU",
  });

  const events = useSelector(selectEvents);

  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);

  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );
  return (
    <Container>
      <GoogleMap
        zoom={10}
        center={{ lat: latitude, lng: longitude }}
        mapContainerStyle={{ width: 500, height: 500 }}
      >
        {events.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{
              lat: marker.venue.location.lat,
              lng: marker.venue.location.lon,
            }}
          />
        ))}
      </GoogleMap>
    </Container>
  );
}
