import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";

const Signout = () => {
    const navigate=useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/signup");
    } catch (err) {
      console.error("Failed to log out: ", err.message);
    }
  };

  return (
    <div className="form-container">
        <div>
        <Button onClick={logOut} style={{ fontSize: "15px", padding: "7px 180px" }}>
      Log Out
    </Button>
        </div>
     
    </div>
   
  );
};

export default Signout;
