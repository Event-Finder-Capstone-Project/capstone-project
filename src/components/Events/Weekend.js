import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { addEvents } from "../../store/eventsSlice";
import { useLoadScript } from "@react-google-maps/api";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { Nav, Row, Container, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import TestMap from "../Maps/TestMap";
import CityFilter from "./CityFilter";
import Autocomplete from "react-google-autocomplete";

const Weekend = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [clickedEvents, setClickedEvents] = useState([]);

  const dispatch = useDispatch();

  /*   useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]); */

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const events = useSelector(selectEvents);
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);

  const city = useSelector((state) => state.search.city);
  const state = useSelector((state) => state.search.state);

  useEffect(() => {
    if ((city !== null && state !== null) || (latitude && longitude)) {
        const today = new Date();
        const startOfWeek = new Date(today);
        const endOfWeek = new Date(today);

        const dayOfWeek = today.getDay();

        const daysUntilFriday = 5 - dayOfWeek; 
        const daysUntilSunday = 7 - dayOfWeek + 1;

        startOfWeek.setDate(today.getDate() + daysUntilFriday);
    endOfWeek.setDate(today.getDate() + daysUntilSunday);

    const fetchEventData = async () => {
      let eventDataParams = {
        type: filter,
        page: page,
        dateRange: {
            startDate: startOfWeek.toISOString().split("T")[0],
            endDate: endOfWeek.toISOString().split("T")[0],
        }
      };
  
      if (city && state) {
        eventDataParams = {
          ...eventDataParams,
          venue: {
            city: city,
            state: state
          }
        };
      } else if (latitude && longitude) {
        eventDataParams = {
          ...eventDataParams,
          latitude: latitude,
          longitude: longitude
        };
      }
  console.log('event data: ', eventDataParams)
      dispatch(getAllEvents(eventDataParams));
    };
  
    fetchEventData();
  }
  }, [dispatch, filter, page, city, state, latitude, longitude]);

  useEffect(() => {
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
    const fetchUserEvents = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserEvents(userData.events || []);
        }
      }
    };
    fetchEventsData();
    fetchUserEvents();
  }, []);

  const handleAddEvents = async (eventId) => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);

      // Add the event ID to the user's events array in Firestore
      await updateDoc(userDocRef, {
        events: [...userEvents, eventId],
      });

      // Update the local state
      setUserEvents([...userEvents, eventId]);
    } else {
      // For guest users, add the event to local storage
      dispatch(addEvents(eventId));
    }
    setClickedEvents((prevClicked) => [...prevClicked, eventId]);
  };

  const handleFilter = () => {
    setPage(1);
    dispatch(getAllEvents({ type: filter, page: 1 }));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const {isLoaded} = useLoadScript({ googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU", libraries: ['places'], })

  return (
    <>
      <div className="filter-container">
        <Container
          style={{ marginTop: ".5rem" }}
          className="d-flex justify-content-center"
        >
          <h5
            style={{
              marginRight: "1rem",
              paddingTop: ".3rem",
            }}
          >
            Event Type
          </h5>
          <select
            style={{ height: "35px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">None</option>
            {eventsData.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>

          <Button
            style={{ marginLeft: "1rem", height: "35px" }}
            variant="secondary"
            onClick={handleFilter}
          >
            Filter
          </Button>
        </Container>
      </div>
      <h1 style={{ marginTop: "1rem" }}> Happening This Weekend </h1>

           {isLoaded && <CityFilter />} 


      <Container
        fluid="lg"
        class="text-center"
        className="all-events-container"
        style={{ marginTop: "3rem" }}
      >
        <Container style={{ marginTop: "1.5rem", marginBottom: "3rem" }}>
         <TestMap /> 
        </Container>
        <Row xs={1} md={2} lg={2} className="g-4">
          {events?.length ? (
            events.map((event) => (
              <Card
                style={{
                  border: "none",
                  textDecoration: "none",
                }}
                class="card classWithPad"
                className="event-container"
                key={event.id}
                xs={{ width: "100%" }}
              >
                <LinkContainer to={`/events/${event.id}`}>
                  <Nav.Link>
                    <Card.Img
                      variant="top"
                      src={event.performers[0].image}
                      alt={event.name}
                    />
                    <Card.Body
                      style={{
                        backgroundColor: "black",
                        opacity: "50%",
                      }}
                    >
                      <Card.Title style={{ color: "white" }} id="event-name">
                        {event.title}
                      </Card.Title>
                    </Card.Body>
                  </Nav.Link>
                </LinkContainer>
                {!clickedEvents.includes(event.id) && (
                  <Button
                    variant="secondary"
                    onClick={() => handleAddEvents(event.id)}
                  >
                    Add Event
                  </Button>
                )}
              </Card>
            ))
          ) : (
              <p>{!events?.length ? "No events found... try checking a different location!" : ""}</p>
          )}
        </Row>
      </Container>
      <Container
        className="d-flex justify-content-center"
        style={{ marginTop: "2rem" }}
      >
        <Button
          variant="secondary"
          style={{ marginRight: "1rem" }}
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <Button variant="secondary" onClick={handleNextPage}>
          Next
        </Button>
      </Container>
    </>
  );
};

export default Weekend;
