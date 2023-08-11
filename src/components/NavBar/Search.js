import React, { useState } from "react";
import SearchBar from "./SearchComponents/SearchBar";
import { useDispatch } from "react-redux";
import { setQuery } from "../../store/searchSlice";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [localQuery, setLocalQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSetQuery = (query) => {
    setLocalQuery(query);
  };

  const handleSearchSubmit = () => {
    dispatch(setQuery(localQuery));
    navigate("/searchresults");
  };

  return (
    <>
      <div>
        <SearchBar onSubmit={handleSetQuery} />
        <button onClick={handleSearchSubmit}>Submit</button>
      </div>
    </>
  );
};

export default Search;
