import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Signup,
  Login,
  SingleEvent,
  AllEventsNew,
  Home,
  UserDetails,
  UserEventsTwo,
  UserProfile,
  SearchResults,
  Today,
  Weekend,
  NavBarTwo,
} from "./";
import { setCityState, setLocation } from "../store/locationSlice";
import mitt from "mitt";

export const eventEmitter = mitt();

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch events data from firebase
    const fetchEventsData = async () => {
      try {
        const eventsQuerySnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsQuerySnapshot.docs.map(
          (doc) => doc.data().type
        );
        setEventsData(eventsData);
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };
    fetchEventsData();
  }, []);

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
      <NavBarTwo />
      <Container>
        {userLoggedIn ? (
          <div className="w-100 mb-3">
            <Routes>
              <Route path="/events/:id" element={<SingleEvent />} />
              <Route
                path="/events"
                element={<AllEventsNew eventsData={eventsData} />}
              />
              <Route path="/" element={<Home eventsData={eventsData} />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route
                path="/thisweekend"
                element={<Weekend eventsData={eventsData} />}
              />
              <Route path="/myevents" element={<UserEventsTwo />} />
              <Route
                path="/today"
                element={<Today eventsData={eventsData} />}
              />
              <Route
                path="/user-details"
                element={<UserDetails user={user} />}
              />
              <Route
                path="/searchresults"
                element={<SearchResults eventsData={eventsData} />}
              />
            </Routes>
          </div>
        ) : (
          <div>
            <div>
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/today"
                  element={<Today eventsData={eventsData} />}
                />
                <Route
                  path="/events"
                  element={<AllEventsNew eventsData={eventsData} />}
                />
                <Route path="/events/:id" element={<SingleEvent />} />
                <Route path="/myevents" element={<UserEventsTwo />} />
                <Route
                  path="/thisweekend"
                  element={<Weekend eventsData={eventsData} />}
                />
                <Route path="/" element={<Home eventsData={eventsData} />} />
                <Route
                  path="/searchresults"
                  element={<SearchResults eventsData={eventsData} />}
                />
              </Routes>
            </div>
          </div>
        )}
      </Container>
    </Router>
  );
}
export default App;
