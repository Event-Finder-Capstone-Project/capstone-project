import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { auth } from "../firebase";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Signout from "./Auth/Signout";
import SingleEvent from "./Events/SingleEvent";
import AllEvents from "./Events/AllEvents";
import NavBar from "./NavBar";
import Home from "./Home";
import UserDetails from "./UserDetails";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <NavBar />
      <Container>
        {userLoggedIn ? (
          <div className="w-100 mb-3">
            <Routes>
              <Route path="/allevents/:id" element={<SingleEvent />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/" element={<Home />} />
              <Route path="/user-details" element={<UserDetails user={user} />} />
            </Routes>
            <Signout />
          </div>
        ) : (
          <div>
            <div>
              <h1 className="title">Event Finder</h1>
            </div>
            <div>
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/events" element={<AllEvents />} />
                <Route path="/events/:id" element={<SingleEvent />} />
              </Routes>
            </div>
            <div className="front-bottom">
              <div className="front-bottom-item">
                <p>
                  New User? <NavLink to="/signup">Sign Up</NavLink>
                </p>
              </div>
              <div className="front-bottom-item">
                <p>
                  Already have an account? <NavLink to="/login">Log In</NavLink>
                </p>
                <Routes>
                  <Route path="/allevents/:id" element={<SingleEvent />} />
                  <Route path="/events" element={<AllEvents />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Router>
  );
}
export default App;
