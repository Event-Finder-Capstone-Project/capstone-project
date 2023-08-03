import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import UserDetails from "./Users/UserDetails";
import UserProfile from "./Users/UserProfile";
import { setLocation } from "../store/locationSlice";
import CalendarEvents from "./Events/CalendarEvents";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator && !postalCode) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ latitude, longitude }));
        },
        (error) => {
          console.error("Error getting user's location:", error.message);
        }
      );
    }
  }, [dispatch, postalCode]);

  return (
    <Router>
      <NavBar />
      <Container>
        {userLoggedIn ? (
          <div className="w-100 mb-3">
            <Routes>
              <Route path="/events/:id" element={<SingleEvent userLocation={userLocation}/>} />
              <Route path="/events" element={<AllEvents userLocation={userLocation}/>} />
              <Route path="/" element={<Home />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/myEvents" element={<CalendarEvents/>} />
              <Route
                path="/user-details"
                element={<UserDetails user={user} />}
              />
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
                <Route path="/events" element={<AllEvents userLocation={userLocation}/>} />
                <Route path="/events/:id" element={<SingleEvent userLocation={userLocation}/>} />
                <Route path="/" element={<Home />} />
                <Route path="/myEvents" element={<CalendarEvents/>} />
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
              </div>
            </div>
          </div>
        )}
      </Container>
    </Router>
  );
}
export default App;
