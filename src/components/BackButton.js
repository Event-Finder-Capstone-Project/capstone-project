import React from "react";

const BackButton = () => {
  const handleBack = () => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
    }
    window.history.back();
  };

  return (
    <button id="back-button" onClick={handleBack}>Back</button>
  );
};

export default BackButton;
