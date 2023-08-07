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
import NavBar from "./NavBar/NavBar.js";
import Home from "./Home";
import UserDetails from "./Users/UserDetails";
import UserProfile from "./Users/UserProfile";
import { setLocation } from "../store/locationSlice";
import UserEvents from "./Users/UserEvents";
import SearchResults from "./Events/SearchResults";
import Today from "./Events/Today";
import CalendarEvents from "./Users/CalendarEvents";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const { postalCode } = useSelector((state) => state.location);

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
              <Route path="/events/:id" element={<SingleEvent />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/" element={<Home />} />
              <Route path="/user-profile" element={<UserProfile />} />
              {/* <Route path="/myEvents" element={<CalendarEvents/>} /> */}
              <Route path="/myevents" element={<UserEvents />} />
              <Route path="/today" element={<Today />} />
              <Route
                path="/user-details"
                element={<UserDetails user={user} />}
              />
              <Route path="/searchresults" element={<SearchResults />} />
            </Routes>
            <Signout />
          </div>
        ) : (
          <div>
            {/* <div>
              <h1 className="title">Event Finder</h1>
            </div> */}
            <div>
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/today" element={<Today />} />
                <Route path="/events" element={<AllEvents />} />
                <Route path="/events/:id" element={<SingleEvent />} />
                <Route path="/myevents" element={<UserEvents />} />
                <Route path="/" element={<Home />} />
                <Route path="/searchresults" element={<SearchResults />} />
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
