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
  const searchEvents = useSelector((state) => state.search.events);
  const selectedEventId = useSelector((state) => state.hoverId);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [keyCounter, setKeyCounter] = useState(0);

  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);

  const searchLAT = useSelector((state) => state.search.lat);
  const searchLNG = useSelector((state) => state.search.lng);

  const lat = searchLAT === "" ? latitude : searchLAT;
  const lng = searchLNG === "" ? longitude : searchLNG;

  localStorage.setItem("mapCenterLat", lat);
  localStorage.setItem("mapCenterLng", lng);

  useEffect(() => {
    setKeyCounter((prevCounter) => prevCounter + 1);
  }, [selectedEventId]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );

    const eventsToMap = searchEvents.length ? searchEvents : events;

  return (
    <Container>
      <GoogleMap
        zoom={10}
        center={{ lat: lat, lng: lng }}
        mapContainerClassName="google-map-container">
        {eventsToMap.map((marker) => (
          <MarkerF
            key={`${marker.id}-${keyCounter}`}
            position={{
              lat: marker.venue.location.lat,
              lng: marker.venue.location.lon,
            }}
            icon={
              marker.id === selectedEventId
                ? {
                    url: marker.performers[0].image,
                    scaledSize: new window.google.maps.Size(32, 32), // Set the desired size
                    anchor: new window.google.maps.Point(16, 32),
                    className: "customMarker",
                  }
                : null
            }
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
              <p>{formatDate(selectedEvent.datetime_local)}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEvent.venue.location.lat},${selectedEvent.venue.location.lon}`}
                target="_blank"
                rel="noopener noreferrer">
                Get Directions
              </a>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </Container>
  );
}
