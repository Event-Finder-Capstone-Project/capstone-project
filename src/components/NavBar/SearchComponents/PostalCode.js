import React from "react";

const PostalCode = ({ onSetPostalCode }) => {
  const handlePostalCodeChange = (e) => {
    onSetPostalCode(e.target.value);
  };

  return (
    <input
      type="text"
      onChange={handlePostalCodeChange}
      placeholder="Enter Zip Code"
    />
  );
};

export default PostalCode;
