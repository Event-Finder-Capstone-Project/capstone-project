import React, { useState } from "react";
import SearchBar from "./SearchComponents/SearchBar";
import { useDispatch } from "react-redux";
import { setQuery } from "../../store/searchSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
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
    <div className="searchComponent">
      <SearchBar onSubmit={handleSetQuery} />
      <Button
        size="sm"
        style={{ width: "2rem", height: "2rem", marginTop: "-.26rem" }}
        variant="secondary"
        onClick={handleSearchSubmit}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ color: "#ffffff" }}
        />
      </Button>
    </div>
  );
};

export default Search;
