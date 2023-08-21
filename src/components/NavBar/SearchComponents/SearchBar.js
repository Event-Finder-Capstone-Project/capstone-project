import React from "react";
import "../../style/index.css";

const SearchBar = ({ onSubmit }) => {
  const handleQueryChange = (e) => {
    onSubmit(e.target.value);
  };

  return (
    <input
      type="text"
      onChange={handleQueryChange}
      placeholder="Search events"
      style={{ width: "150px", height: "2rem" }}
    />
  );
};

export default SearchBar;
