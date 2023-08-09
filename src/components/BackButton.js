import React from "react";
import { Button } from "react-bootstrap";

const BackButton = () => {
  const handleBack = () => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
    }
    window.history.back();
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
