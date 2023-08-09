import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents } from "../../store/allEventsSlice";
import { addEvents } from "../../store/eventsSlice";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState } from "react";
import { getSearchResults, setDateRange } from "../../store/searchSlice";
import DatePicker from "../NavBar/SearchComponents/DatePicker";
import { useLoadScript } from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";
import CityFilter from "./CityFilter";

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [rerender, setRerender] = useState(false);
  const searchState = useSelector((state) => state.search);
  const events = useSelector((state) => state.search.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSearchResults({ query: searchState.query, postalCode: searchState.postalCode, dateRange: searchState.dateRange }));
  }, [dispatch, searchState.query, searchState.postalCode, searchState.dateRange]);



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
              {!userEvents.includes(event.id) && (
                <button onClick={() => handleAddEvents(event.id)}>
                  Add Event
                </button>
              )}
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
