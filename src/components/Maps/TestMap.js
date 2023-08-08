import React, { useEffect, useState, useMemo } from "react";
import { 
  GoogleMap, 
  useLoadScript, 
  MarkerF, 
  InfoWindowF
} from "@react-google-maps/api";
import { Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import '../style/index.css'
export default function TestMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU",
  });

  const events = useSelector(selectEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);

  if (!isLoaded)
    return (
      <Container>
        <h4>Map Loading</h4>
      </Container>
    );
    return (
      <Container style={{ width: "120%", marginLeft: "-2.2rem" }}>
        <GoogleMap
          zoom={10}
          center={{ lat: latitude, lng: longitude }}
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
      <h4>{selectedEvent.title}</h4>
      <p>{selectedEvent.venue.name}</p>
      <p>{selectedEvent.venue.city}</p>
    </div>
  </InfoWindowF>
)}
        </GoogleMap>
      </Container>
    );
  }
