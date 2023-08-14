import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth,db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAllEvents } from "../../store/allEventsSlice";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { Button, Card, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { getSearchResults, setDateRange } from "../../store/searchSlice";
import DatePicker from "../NavBar/SearchComponents/DatePicker";

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const searchState = useSelector((state) => state.search);
  const events = useSelector((state) => state.search.events);
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getSearchResults({
        query: searchState.query,
        postalCode: searchState.postalCode,
        dateRange: searchState.dateRange,
      })
    );
  }, [
    dispatch,
    searchState.query,
    searchState.postalCode,
    searchState.dateRange,
  ]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserEvents(userData.events || []);
        }
      } else {
        setUserEvents(savedEventIds || []);
      }
    };
    fetchUserEvents();
  }, []);

  //handle add and remove event use icon
  const handleAddEvents = (eventId) => {
    if (auth.currentUser) {
      dispatch(handleEventAsync(eventId));
    } else {
      dispatch(handleEvents(eventId));
    }
    // Toggle the event in userEvents state
    if (userEvents.includes(eventId)) {
      setUserEvents(userEvents.filter((id) => id !== eventId));
    } else {
      setUserEvents([...userEvents, eventId]);
    }
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

  const handleSelectDateRange = (dateRange) => {
    dispatch(setDateRange(dateRange));
  };

  return (
    <>
      <DatePicker onSelectDateRange={handleSelectDateRange} />

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

      <div className="all-events-container">
        {events?.length ? (
          events.map((event) => (
            <Card
              style={{ width: "18rem", textDecoration: "none" }}
              class="card"
              className="event-container"
              key={event.id}>
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
              <Button
                variant="outline"
                style={{
                  border: "none",
                  fontSize: "32px",
                }}
                onClick={() => handleAddEvents(event.id)}>
                <FontAwesomeIcon
                  icon={userEvents.includes(event.id) ? solidStar : outlineStar}
                />
              </Button>
            </Card>
          ))
        ) : (
          <p>{filter === "" ? "Loading events..." : "Events not found 😢"}</p>
        )}
      </div>
      <div className="pageButtons">
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </>
  );
};

export default SearchResults;
