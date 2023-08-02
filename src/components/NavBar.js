import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./style/navbar.css";
import { setPostalCode } from "../store/locationSlice";
import Toastify from 'toastify-js'

const NavBar = () => {
  const dispatch = useDispatch();
  const postalCode = useSelector((state) => state.location.postalCode);
  const [inputPostalCode, setInputPostalCode] = useState(postalCode);

    const handlePostalCodeSubmit = (e) => {
      e.preventDefault();
      const isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
      if (!isValidZip.test(inputPostalCode)) {
        Toastify({
          text: "Please input a valid zip code!",
          duration: 2000,
          close: true,
          gravity: "top", 
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      } else {
        dispatch(setPostalCode(inputPostalCode));
      }
    };

  return (
    <div id="navbar" className="navbar">
      <NavLink to="/" className="navlink">
        Home
      </NavLink>
      <NavLink to="/myevents" className="navlink">
        Your Events
      </NavLink>
      <NavLink to="/thisweekend" className="navlink">
        This Weekend
      </NavLink>
      <NavLink to="/today" className="navlink">
        Today
      </NavLink>
      <NavLink to="/free" className="navlink">
        Free
      </NavLink>
      <NavLink to="/login" className="navlink">
        Login
      </NavLink>
      <NavLink to="/signup" className="navlink">
        Sign Up
      </NavLink>
<form onSubmit={handlePostalCodeSubmit}>
        <input
          type="text"
          value={inputPostalCode}
          onChange={(e) => setInputPostalCode(e.target.value)}
          placeholder="Enter Zip Code"
        />
        <button type="submit">Submit</button>
      </form>
      </div>
  );
};

export default NavBar;
