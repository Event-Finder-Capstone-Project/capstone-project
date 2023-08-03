import React from "react";
import SearchBar from "./SearchComponents/SearchBar";
import DatePicker from "./SearchComponents/DatePicker";
import PostalCode from "./SearchComponents/PostalCode";

const Search = () => {

    return (
        <>
        <SearchBar />
          <DatePicker />
          <PostalCode />
        </>
      );
    }

export default Search;