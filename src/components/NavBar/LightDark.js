import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb as lightModeIcon } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as darkModeIcon } from "@fortawesome/free-regular-svg-icons";
import { Button } from "react-bootstrap";

const LightDark = () => {
  const [darkMode, setDarkMode] = useState(true);
  //   let darkMode = true;
  const htmlTag = document.getElementById("html");
  const handleSetMode = () => {
    if (darkMode === true) {
      htmlTag.setAttribute("data-bs-theme", "light");
      setDarkMode(false);
      console.log(darkMode);
    } else {
      htmlTag.setAttribute("data-bs-theme", "dark");
      setDarkMode(true);
      console.log(darkMode);
    }
  };

  return (
    <Button
      variant="outline"
      style={{
        width: "2rem",
        height: "2rem",
        border: "none",
        color: "darkorange",
      }}
      onClick={() => handleSetMode()}
    >
      <FontAwesomeIcon
        style={{ width: "1.5rem", height: "1.5rem" }}
        icon={darkMode === true ? darkModeIcon : lightModeIcon}
      />
    </Button>
  );
};

export default LightDark;
