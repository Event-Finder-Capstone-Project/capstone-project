import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCity, setCoords } from "../../store/searchSlice";
import { eventEmitter } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import "../style/index.css";

const CityFilter = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const dispatch = useDispatch();

   // Get user's location using geolocation API
  const askForLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Reset user's selected city and state
        localStorage.setItem("userCity", "");
        localStorage.setItem("userState", "");
        localStorage.setItem("mapCenterLat", latitude);
        localStorage.setItem("mapCenterLng", longitude);

         // Emit city change event and update Redux state
        eventEmitter.emit("cityChanged", { latitude, longitude });
        dispatch(
          setCoords({
            lat: latitude,
            lng: longitude,
          })
        );
      } catch (error) {
        console.error("Error getting location:", error);
      }
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  // Reset location based on user-selected place
  useEffect(() => {
    if (selectedPlace) {
      const placeId = selectedPlace.place_id;

      // Use Google Places API to get place details
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {

          // Extract city and state from place information
          const city = place.address_components.find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_3")
          )?.long_name;

          const state = place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.short_name;

          const latitude = place.geometry.location.lat(city);
          const longitude = place.geometry.location.lng(city);

          // Update Redux state and local storage
          dispatch(
            setCity({
              city: city || "",
              state: state || "",
            })
          );
          dispatch(
            setCoords({
              lat: latitude,
              lng: longitude,
            })
          );

          localStorage.setItem("userCity", city || "");
          localStorage.setItem("userState", state || "");
          // Emit city change event
          eventEmitter.emit("cityChanged", { city, state });
        }
      });
    }
  }, [dispatch, selectedPlace]);

  // Handle user-selected place
  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    console.log(selectedPlace);
  };

  return (
    <>
      <div style={{ width: "200px", marginTop: "1rem", marginRight: ".5rem" }}>
        <Autocomplete
          apiKey={process.env.REACT_APP_FIREBASE_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["(cities)"],
            componentRestrictions: { country: ["us", "ca"] },
            placeholder: "hello",
          }}
        />

        <Button
          variant="secondary"
          size="sm"
          style={{ width: "189px" }}
          onClick={askForLocation}
        >
          <FontAwesomeIcon icon={faLocationDot} /> Use Current Location
        </Button>
      </div>
    </>
  );
};

export default CityFilter;
