import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { addEvents } from "../../store/eventsSlice";
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
import Maps from "../Maps/Maps";
import CityFilter from "./EventFilter/CityFilter";


const Today = () => {
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

  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1);

      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          latitude: latitude,
          longitude: longitude,
          dateRange: { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0]}
        })
      );
  }, [dispatch, filter, page, latitude, longitude]);

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

  return (
    <>
      <div className="filter-container">
        <div>
          <label>Event Type</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">None</option>
            {eventsData.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleFilter}>Filter</Button>
      </div>
<h1> Happening Today </h1>
<CityFilter />

      <Container
        fluid="lg"
        class="text-center"
        className="all-events-container"
        style={{ marginTop: "3rem" }}
      >
        <Row xs={1} md={2} lg={2} className="g-4">
          {events?.length ? (
            events.map((event) => (
              <Card
                style={{
                  border: "none",
                  width: "18rem",
                  textDecoration: "none",
                }}
                class="card classWithPad"
                className="event-container"
                key={event.id}
              >
                <LinkContainer to={`/events/${event.id}`}>
                  <Nav.Link>
                    <Card.Img
                      variant="top"
                      src={event.performers[0].image}
                      alt={event.name}
                    />
                    <Card.Body style={{ background: "grey" }}>
                      <Card.Title style={{}} id="event-name">
                        {event.title}
                      </Card.Title>
                    </Card.Body>
                  </Nav.Link>
                </LinkContainer>
                {!clickedEvents.includes(event.id) && (
                  <Button onClick={() => handleAddEvents(event.id)}>
                    Add Event
                  </Button>
                )}
              </Card>
            ))
          ) : (
            <p>{filter === "" ? "Loading events..." : "Events not found 😢"}</p>
          )}
        </Row>
      </Container>
      <div className="pageButtons">
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
      <div>
        <Maps />
      </div>
    </>
  );
};

export default Today;
