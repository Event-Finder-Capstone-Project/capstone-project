import React, { useState } from "react";
import SearchBar from "./SearchComponents/SearchBar";
import { useDispatch } from "react-redux";
import { setQuery } from "../../store/searchSlice";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import "../style/index.css";

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
    <div
      style={{
        marginTop: "1rem",
        marginRight: ".5rem",
        marginLeft: ".5rem",
        width: "200px",
      }}
    >
      <SearchBar onSubmit={handleSetQuery} />
      <Button
        size="sm"
        style={{ width: "189px" }}
        variant="secondary"
        onClick={handleSearchSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default Search;