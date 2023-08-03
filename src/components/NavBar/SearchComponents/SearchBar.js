import React from "react";


const SearchBar = ({ onSubmit} ) => {
 const handleQueryChange = (e) => {
    onSubmit(e.target.value);
  };

    return (
      <input
        type="text"
        onChange={handleQueryChange}
        placeholder="Search events"
      />
    );
    };

export default SearchBar;