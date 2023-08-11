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

  const askForLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude);

        localStorage.setItem("userCity", "");
        localStorage.setItem("userState", "");
        localStorage.setItem("mapCenterLat", latitude);
        localStorage.setItem("mapCenterLng", longitude);

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

          const latitude = place.geometry.location.lat(city);
          const longitude = place.geometry.location.lng(city);

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
          eventEmitter.emit("cityChanged", { city, state });
        }
      });
    }
  }, [dispatch, selectedPlace]);
  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    console.log(selectedPlace);
  };

  return (
    <>
      <div>
        <Autocomplete
          apiKey={process.env.REACT_APP_FIREBASE_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["(cities)"],
            componentRestrictions: { country: ["us", "ca"] },
            placeholder: "hello",
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
