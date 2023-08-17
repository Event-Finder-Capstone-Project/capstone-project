import React from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter");
  const page = queryParams.get("page");
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
