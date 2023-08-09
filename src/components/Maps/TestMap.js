import React, { useEffect, useState, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import "../style/index.css";

export default function TestMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU",
    libraries: ["places"],
  });

  const events = useSelector(selectEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);

  const searchLAT = useSelector((state) => state.search.lat);
  const searchLNG = useSelector((state) => state.search.lng);

  const lat = searchLAT === "" ? latitude : searchLAT;
  const lng = searchLNG === "" ? longitude : searchLNG;

  console.log("mapLocation", lat, lng);

  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );
  return (
    <Container style={{ width: "120%", marginLeft: "-2.2rem" }}>
      <GoogleMap
        zoom={11}
        center={{ lat: lat, lng: lng }}
        mapContainerStyle={{ width: "100%", height: 350 }}
      >
        {events.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{
              lat: marker.venue.location.lat,
              lng: marker.venue.location.lon,
            }}
            onClick={() => setSelectedEvent(marker)}
          />
        ))}
        {selectedEvent && (
          <InfoWindowF
            position={{
              lat: selectedEvent.venue.location.lat,
              lng: selectedEvent.venue.location.lon,
            }}
            onCloseClick={() => setSelectedEvent(null)}
          >
            <div className="custom-infowindow-content">
              <h6>{selectedEvent.title}</h6>
              <p>{selectedEvent.venue.name}</p>
              <p>{selectedEvent.venue.city}</p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </Container>
  );
}
