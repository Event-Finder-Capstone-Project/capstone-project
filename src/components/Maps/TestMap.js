import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { Container, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectEvents } from "../../store/allEventsSlice";
import "../style/index.css";

export default function TestMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

  localStorage.setItem("mapCenterLat", lat);
  localStorage.setItem("mapCenterLng", lng);

  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );

  return (
    <Container>
      <GoogleMap
        zoom={11}
        center={{ lat: lat, lng: lng }}
        mapContainerClassName="google-map-container"
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
              <p>
                {" "}
                {selectedEvent.venue.address}
                <br />
                {selectedEvent.venue.extended_address}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEvent.venue.location.lat},${selectedEvent.venue.location.lon}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </Container>
  );
}
