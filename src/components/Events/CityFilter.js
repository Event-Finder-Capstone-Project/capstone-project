import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCity, setCoords } from "../../store/searchSlice";
import { setCityState } from "../../store/locationSlice";
import { eventEmitter } from "../App";

const CityFilter = () => {
    const [selectedPlace, setSelectedPlace] = useState(null); 
    const dispatch = useDispatch();

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
          eventEmitter.emit('cityChanged', { city, state });
        }
      });
    }
  }, [dispatch, selectedPlace]);

    return (
      <>
      <div>
      📍
        <Autocomplete
  apiKey="AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU"
  onPlaceSelected={(place) => {
    setSelectedPlace(place);
  }}
/>
</div>
</>
    );
  };


export default CityFilter;
