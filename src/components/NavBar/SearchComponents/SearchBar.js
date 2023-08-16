import React from "react";
import { InputGroup, Form } from "react-bootstrap";
import "../../style/index.css";

const SearchBar = ({ onSubmit }) => {
  const handleQueryChange = (e) => {
    onSubmit(e.target.value);
  };

  return (
    <InputGroup style={{ width: "200px" }}>
      <Form.Control
        type="text"
        onChange={handleQueryChange}
        placeholder="Search events"
      />
    </InputGroup>
  );
};

export default SearchBar;
