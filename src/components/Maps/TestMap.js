import React, { useState, useEffect } from "react";
// importing google maps components
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { Container} from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectEvents } from "../../store/allEventsSlice";
import "../style/index.css";

export default function TestMap() {
  // Load Google Maps script using API key from environment variables
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

  const [mapCenter, setMapCenter] = useState(
    searchEvents.length ? { lat: 40.05, lng: -96.21 } : { lat: lat, lng: lng }
  );
  const [mapZoom, setMapZoom] = useState(
    searchEvents.length ? 4 : 10
  );

  useEffect(() => {
    const savedCenterLat = localStorage.getItem('mapCenterLat');
    const savedCenterLng = localStorage.getItem('mapCenterLng');
    const savedZoom = localStorage.getItem('mapZoom');

    if (savedCenterLat && savedCenterLng) {
      setMapCenter({
        lat: parseFloat(savedCenterLat),
        lng: parseFloat(savedCenterLng),
      });
    }

    if (savedZoom) {
      setMapZoom(parseInt(savedZoom));
    }
  }, []); 


  const handleMapLoad = (map) => {
    const handleMapDragEnd = () => {
      if (map) {
        const center = map.getCenter();
        setMapCenter({ lat: center.lat(), lng: center.lng() });
        // save the current mapCenter to local storage
        localStorage.setItem('mapCenterLat', center.lat());
        localStorage.setItem('mapCenterLng', center.lng());
      }
    };

    const handleZoomChanged = () => {
      if (map) {
        setMapZoom(map.getZoom());
        // save the current mapZoom to local storage
        localStorage.setItem('mapZoom', map.getZoom());
      }
    };

    map.addListener('dragend', handleMapDragEnd);
    map.addListener('zoom_changed', handleZoomChanged);
  };

  useEffect(() => {
    const newLat = searchLAT === '' ? latitude : searchLAT;
    const newLng = searchLNG === '' ? longitude : searchLNG;

    if (newLat !== mapCenter.lat || newLng !== mapCenter.lng) {
      setMapCenter({ lat: newLat, lng: newLng });
      setMapZoom(10); 
    }
  }, [searchLAT, searchLNG]);

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
        zoom={mapZoom}
        center={mapCenter}
        mapContainerClassName="google-map-container"
        onLoad={handleMapLoad}
        >
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
                    url: process.env.PUBLIC_URL + '/Location.png',
                    scaledSize: new window.google.maps.Size(40, 40), // Set the desired size
                    anchor: new window.google.maps.Point(16, 32),
                    zIndex: 1000,
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
