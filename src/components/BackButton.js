import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();


  const handleBack = () => {
      navigate(-1);
  };

  return (
    <Button
      style={{ marginBottom: "1rem" }}
      variant="secondary"
      id="back-button"
      onClick={handleBack}
    >
      Back
    </Button>
  );
};

export default BackButton;
