import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Search, SingleEvent } from "../index";
import {
  Container,
  Nav,
  Navbar,
  Image,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import Signout from "../Auth/Signout";
import { useLoadScript } from "@react-google-maps/api";
import CityFilter from "../Events/CityFilter";

import "../style/index.css";

const NavBarTwo = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return (
    <>
      {userLoggedIn ? (
        <>
          <Navbar
            bg="dark"
            key={"xl"}
            expand={"xl"}
            className="bg-body-tertiary mb-3 justify-content-end flex-grow-1 pe-3"
          >
            <Container fluid>
              <Navbar.Brand href="/">
                <Image src="/favicon.ico" />
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xl" />
              <Navbar.Offcanvas
                id="offcanvasNavbar-expand-xl"
                aria-labelledby="offcanvasNavbarLabel-expand-xl"
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title
                    id="offcanvasNavbarLabel-expand-xl"
                    style={{ fontSize: "28px" }}
                  >
                    Navigation
                  </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <NavDropdown.Item href="/" className="navlink">
                      Home
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/myevents" className="navlink">
                      Your Events
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/thisweekend" className="navlink">
                      This Weekend
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/today" className="navlink">
                      Today
                    </NavDropdown.Item>
                    <Search />
                    {isLoaded && <CityFilter />}
                    <Signout lgs={{ width: "3rem" }} />
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        </>
      ) : (
        <>
          <Navbar
            bg="dark"
            key={"xl"}
            expand={"xl"}
            className="bg-body-tertiary mb-3 justify-content-end flex-grow-1 pe-3"
          >
            <Container fluid>
              <Navbar.Brand href="/">
                <Image src="/favicon.ico" />
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xl" />
              <Navbar.Offcanvas
                id="offcanvasNavbar-expand-xl"
                aria-labelledby="offcanvasNavbarLabel-expand-xl"
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id="offcanvasNavbarLabel-expand-xl">
                    Navigation
                  </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <NavDropdown.Item href="/" className="navlink">
                      Home
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/myevents" className="navlink">
                      Your Events
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/thisweekend" className="navlink">
                      This Weekend
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/today" className="navlink">
                      Today
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/login" className="navlink">
                      Login
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/signup" className="navlink">
                      Signup
                    </NavDropdown.Item>
                    <Search />
                    {isLoaded && <CityFilter />}
                    <Signout lgs={{ width: "3rem" }} />
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        </>
      )}
    </>
  );
};

export default NavBarTwo;
