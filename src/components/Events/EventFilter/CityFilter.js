import {
    CitySelect,
    StateSelect,
  } from "react-country-state-city";
  import { useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import { setLocation } from "../../../store/locationSlice";
import "react-country-state-city/dist/react-country-state-city.css";

  function CityFilter() {
    const dispatch = useDispatch();
    const { state: userState, city: userCity, county: userCounty } = useSelector(state => state.location);
    const [stateid, setstateid] = useState(0);
    const [city, setCity] = useState("");
    const countryid = 233;

    const handleSubmit = () => {
        dispatch(setLocation({ state: stateid, city }));
      };

      const placeholderText = userCity
      ? userCity
      : userCounty
      ? userCounty
      : "Enter a city";

    return (
      <div>
        <h6>State</h6>
        <StateSelect
          countryid={countryid}
          onChange={(e) => {
            setstateid(e.id);
          }}
          placeHolder={userState}
        />
        <h6>City</h6>
        <CitySelect
          countryid={countryid}
          stateid={stateid}
          onChange={(e) => {
            setCity(e.id);
          }}
          placeHolder={placeholderText}
        />
            <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }

  export default CityFilter