import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { addEvents } from "../../store/eventsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons"; 
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
import Carousel from "./Carousel";
import { eventEmitter } from "../App";

const AllEvents = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [clickedEvents, setClickedEvents] = useState([]);
  const [rerender, setRerender] = useState(false);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");

  const dispatch = useDispatch();

  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);

  useEffect(() => {
    const cityChangedListener = (data) => {
      setRerender(!rerender); 
    };

    eventEmitter.on('cityChanged', cityChangedListener);

    return () => {
      eventEmitter.off('cityChanged', cityChangedListener);
    };
  }, [rerender]);

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

  useEffect(() => {
    if (storedCity && storedState) {
      const venue = {
        city: storedCity,
        state: storedState
      };
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          venue: venue
        })
      );
    } else {
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          latitude: latitude,
          longitude: longitude,
        })
      );
    }
  }, [dispatch, filter, page, latitude, longitude, storedCity, storedState]);

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
    setClickedEvents([...clickedEvents, eventId]);
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

  return (
    <>
      <h1> Popular in your area </h1>
      <Carousel />

      <Container
        fluid="lg"
        class="text-center"
        className="all-events-container"
        style={{ marginTop: "3rem" }}
      >
        <Container style={{ marginTop: "1.5rem", marginBottom: "3rem" }}>
          <TestMap />
        </Container>

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


        </Container>
      </div>

        <Row xs={1} md={2} lg={4} className="g-4">
          {events?.length ? (
            events.map((event) => (
              <Card
                style={{
                  border: "none",
                  textDecoration: "none",
                }}
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
                <div className="star-button-container">
                {!clickedEvents.includes(event.id) &&
        !userEvents.includes(event.id) ? (
          <Button onClick={() => handleAddEvents(event.id)}>
          <FontAwesomeIcon icon={faStar} />
          </Button>
        ) : (
          <Button variant="secondary" disabled>
           <FontAwesomeIcon icon={faStar} />
          </Button>
        )}
        </div>
      </Card>
            ))
          ) : (
            <p>{!events?.length ? "No events found!" : ""}</p>
          )}
        </Row>
      </Container>
      <Container
        className="d-flex justify-content-center"
        style={{ alignContent: "center", marginTop: "2rem" }}
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

export default AllEvents;
