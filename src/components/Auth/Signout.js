import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";

const Signout = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/signup");
    } catch (err) {
      console.error("Failed to log out: ", err.message);
    }
  };

  return (
    <div className="form-container" style={{ marginRight: "1rem" }}>
      <Button
        variant="secondary"
        size="sm"
        onClick={logOut}
        style={{ fontSize: "15px", width: "100px" }}
      >
        Log Out
      </Button>
    </div>
  );
};

export default Signout;
