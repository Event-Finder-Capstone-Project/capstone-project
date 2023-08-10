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
import SingleEvent from "./Events/SingleEvent";
import AllEvents from "./Events/AllEvents";
import NavBar from "./NavBar/NavBar.js";
import Home from "./Home";
import UserDetails from "./Users/UserDetails";
import UserProfile from "./Users/UserProfile";
import { setCityState, setLocation } from "../store/locationSlice";
import UserEvents from "./Users/UserEvents";
import SearchResults from "./Events/SearchResults";
import Today from "./Events/Today";
import Weekend from "./Events/Weekend";
import mitt from 'mitt';

export const eventEmitter = mitt();

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

  const { city } = useSelector((state) => state.location.city);
  const { state } = useSelector((state) => state.location.state);

  useEffect(() => {
    if ("geolocation" in navigator && !city) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ latitude, longitude }));
        },
        (error) => {
          console.error("Error getting user's location:", error.message);
        }
      );
    } else if (city) {
      dispatch(setCityState({ city, state }));
    }
  }, [dispatch, city]);

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
              <Route path="/thisweekend" element={< Weekend />} />
              <Route path="/myevents" element={<UserEvents />} />
              <Route path="/today" element={<Today />} />
              <Route
                path="/user-details"
                element={<UserDetails user={user} />}
              />
              <Route path="/searchresults" element={<SearchResults />} />
            </Routes>
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
                <Route path="/thisweekend" element={< Weekend />} />
                <Route path="/" element={<Home />} />
                <Route path="/searchresults" element={<SearchResults />} />
              </Routes>
            </div>
          </div>
        )}
      </Container>
    </Router>
  );
}
export default App;
