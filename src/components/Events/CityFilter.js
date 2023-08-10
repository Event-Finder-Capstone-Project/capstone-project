import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCity, setCoords } from "../../store/searchSlice";
import { eventEmitter } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const CityFilter = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const dispatch = useDispatch();

  const askForLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          localStorage.setItem("userCity", "");
          localStorage.setItem("userState", "");

          eventEmitter.emit("cityChanged", { latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      const placeId = selectedPlace.place_id;

      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const city = place.address_components.find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_3")
          )?.long_name;

          const state = place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.short_name;

          const postalCode = place.address_components.find((component) =>
            component.types.includes("postal_code")
          )?.long_name;

          const latitude = place.geometry.location.lat(city);
          const longitude = place.geometry.location.lng(city);

          dispatch(
            setCity({
              city: city || "",
              state: state || "",
              zip: postalCode || "",
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
          eventEmitter.emit("cityChanged", { city, state });
        }
      });
    }
  }, [dispatch, selectedPlace]);

  return (
    <>
      <div>
        <Autocomplete
          apiKey={process.env.REACT_APP_FIREBASE_API_KEY}
          onPlaceSelected={(place) => {
            setSelectedPlace(place);
          }}
        />
        <button onClick={askForLocation}>
          <FontAwesomeIcon icon={faLocationDot} /> Use Current Location
        </button>
      </div>
    </>
  );
};

export default CityFilter;
