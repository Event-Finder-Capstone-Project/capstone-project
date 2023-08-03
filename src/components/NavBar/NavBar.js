import React from "react";
import { NavLink } from "react-router-dom";
import "../style/navbar.css";
import Search from "./Search";

const NavBar = () => {

  return (
    <>
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
      </div>
      <Search />
      </>
  );
};

export default NavBar;
