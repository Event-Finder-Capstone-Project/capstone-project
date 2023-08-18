import React, { useState, useEffect } from "react";
// importing google maps components
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
  // Load Google Maps script using API key from environment variables
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
// Retrieving events data from redux store
  const events = useSelector(selectEvents);
  const searchEvents = useSelector((state) => state.search.events);
  const selectedEventId = useSelector((state) => state.hoverId);
// State for the selected event on the map
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [keyCounter, setKeyCounter] = useState(0);
 // Retrieving user's current latitude and longitude from redux store
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);
// Retrieving searched latitude and longitude from redux store
  const searchLAT = useSelector((state) => state.search.lat);
  const searchLNG = useSelector((state) => state.search.lng);
// Determine the latitude and longitude to use based on whether a search has been performed
  const lat = searchLAT === "" ? latitude : searchLAT;
  const lng = searchLNG === "" ? longitude : searchLNG;
// Store the map's center coordinates in local storage
  localStorage.setItem("mapCenterLat", lat);
  localStorage.setItem("mapCenterLng", lng);
// Increment keyCounter whenever selectedEventId changes
  useEffect(() => {
    setKeyCounter((prevCounter) => prevCounter + 1);
  }, [selectedEventId]);
 // Function to format a given date string into MM/DD/YYYY format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
// Display loading message if Google Maps script isn't loaded yet
  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );
// Determine which set of events to display on the map and where the map should be centered and zoomed to
    const eventsToMap = searchEvents.length ? searchEvents : events;
    const mapCenter = searchEvents.length ? { lat: 40.05, lng: -96.21 } : { lat: lat, lng: lng };
    const mapZoom = searchEvents.length ? 4 : 10;
 // Render the map, markers for each event, and an info window for the selected event
  return (
    <Container>
      <GoogleMap
        zoom={mapZoom}
        center={mapCenter}
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
