import React from "react";
import { NavLink } from "react-router-dom";
// import "../style/navbar.css";
import Search from "./Search";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Image,
  Row,
  Col,
} from "react-bootstrap";

const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" expand="xxl" className="bg-body-tertiary">
        <Container fluid="sm">
          <Navbar.Brand href="/">
            <Image src="favicon.ico" />
          </Navbar.Brand>
          <Nav.Link to="/" className="navlink">
            Home
          </Nav.Link>
          <Nav.Link to="/myevents" className="navlink">
            Your Events
          </Nav.Link>
          <Nav.Link to="/thisweekend" className="navlink">
            This Weekend
          </Nav.Link>
          <Nav.Link to="/today" className="navlink">
            Today
          </Nav.Link>
          <Nav.Link to="/free" className="navlink">
            Free
          </Nav.Link>
          <Nav.Link to="/login" className="navlink">
            Login
          </Nav.Link>
          <Nav.Link to="/signup" className="navlink">
            Sign Up
          </Nav.Link>

          <Search />
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
