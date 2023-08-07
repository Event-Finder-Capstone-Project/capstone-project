import React from "react";
import { NavLink } from "react-router-dom";
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
import Signout from "../Auth/Signout";

const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <Image src="favicon.ico" />
          </Navbar.Brand>
          <Nav.Link href="/" className="navlink">
            Home
          </Nav.Link>
          <Nav.Link href="/myevents" className="navlink">
            Your Events
          </Nav.Link>
          <Nav.Link href="/thisweekend" className="navlink">
            This Weekend
          </Nav.Link>
          <Nav.Link href="/today" className="navlink">
            Today
          </Nav.Link>
          <Nav.Link href="/login" className="navlink">
            Login
          </Nav.Link>
          <Nav.Link href="/signup" className="navlink">
            Sign Up
          </Nav.Link>

          <Search />
          <Signout lgs={{ width: "3rem" }} />
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
