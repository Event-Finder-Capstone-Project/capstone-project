import React, { useState } from "react";
import SearchBar from "./SearchComponents/SearchBar";
import DatePicker from "./SearchComponents/DatePicker";
import PostalCode from "./SearchComponents/PostalCode";
import { useDispatch, useSelector } from "react-redux";
import { setPostalCode, setQuery, setDateRange } from "../../store/searchSlice";
import Toastify from 'toastify-js'
import { useNavigate } from "react-router-dom";



const Search = () => {
  const searchState = useSelector((state) => state.search);
  const [localPostalCode, setLocalPostalCode] = useState("");
  const [localQuery, setLocalQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSetPostalCode = (code) => {
    setLocalPostalCode(code);
  };

  const handleSetQuery = (query) => {
    setLocalQuery(query);
  };

  const handleSelectDateRange = (dateRange) => {
    dispatch(setDateRange(dateRange));
  };

  const handleSearchSubmit = () => {
    dispatch(setQuery(localQuery));
      const isValidZip = /(^\d{5}$)/;
      if (!isValidZip.test(localPostalCode)) {
        Toastify({
          text: "Please input a valid 5-digit zip code!",
          duration: 2000,
          close: true,
          gravity: "top", 
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      } else {
        dispatch(setPostalCode(localPostalCode));
        navigate("/searchresults");
      }
    };
  

    return (
        <>
        <SearchBar onSubmit={handleSetQuery}/>
        <DatePicker onSelectDateRange={handleSelectDateRange} />
          <PostalCode onSetPostalCode={handleSetPostalCode} />

          <button onClick={handleSearchSubmit}>Submit</button>
        </>
      );
    }

export default Search;