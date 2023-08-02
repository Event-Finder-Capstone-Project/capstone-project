import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./style/navbar.css";
import { setPostalCode } from "../store/locationSlice";

const NavBar = () => {

  const handlePostalCodeChange = (e) => {
    dispatch(setPostalCode(e.target.value));
  };

  const dispatch = useDispatch();
  const postalCode = useSelector((state) => state.location.postalCode);

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
{/*       we'll need some error handling here in case a user submits an invalid postal code */}
        <input
          type="text"
          value={postalCode}
          onChange={handlePostalCodeChange}
          placeholder="Enter Zip Code"
        />
      </div>
  );
};

export default NavBar;
