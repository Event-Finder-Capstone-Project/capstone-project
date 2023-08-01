import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div id="navbar" className="navbar">
      <NavLink to="/" className="nav">
        Home
      </NavLink>
      <NavLink to="/tasks" className="nav">
        Tasks
      </NavLink>
      <NavLink to="/users" className="nav">
        Users
      </NavLink>
    </div>
  );
};

export default NavBar;
