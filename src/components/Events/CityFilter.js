import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCity } from "../../store/searchSlice";

const CityFilter = () => {
    const [selectedPlace, setSelectedPlace] = useState(null); 
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPlace) {
            console.log('place!!!', selectedPlace)
          dispatch(setCity({
            city: selectedPlace.address_components[0].long_name,
            state: selectedPlace.address_components[2].short_name,
          }));
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


