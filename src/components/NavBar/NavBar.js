import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {Search , SingleEvent} from "../index";
import { Container, Nav, Navbar, Image } from "react-bootstrap";
import Signout from "../Auth/Signout";
import { useLoadScript } from "@react-google-maps/api";
import CityFilter from "../Events/CityFilter";

const NavBar = () => {
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
        <Navbar bg="dark" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/" >
            <Image src="/favicon.ico" />
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
            <Search />
            {isLoaded && <CityFilter />}
            <Signout lgs={{ width: "3rem" }} />
          </Container>
        </Navbar>
      ) : (
        <Navbar bg="dark" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">
            <Image src="/favicon.ico" />
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
            {isLoaded && <CityFilter />}
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default NavBar;
