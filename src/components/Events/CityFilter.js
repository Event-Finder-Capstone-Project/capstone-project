import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../../store/searchSlice";

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

          dispatch(
            setCity({
              city: city || "",
              state: state || "",
              zip: postalCode || "",
            })
          );
        }
      });
    }
  }, [dispatch, selectedPlace]);

    return (

        <Autocomplete
  apiKey="AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU"
  onPlaceSelected={(place) => {
    setSelectedPlace(place);
  }}
/>

    );
  };
  
  export default CityFilter


