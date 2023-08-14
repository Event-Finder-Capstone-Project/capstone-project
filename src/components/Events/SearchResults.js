import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth} from "../../firebase";
import { getAllEvents } from "../../store/allEventsSlice";
import { handleEvents,handleEventAsync } from "../../store/eventsSlice";
import { Nav, Row, Container, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState } from "react";
import { getSearchResults, setDateRange } from "../../store/searchSlice";
import DatePicker from "../NavBar/SearchComponents/DatePicker";
import PrevNext from "./PrevNext";

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const searchState = useSelector((state) => state.search);
  const events = useSelector((state) => state.search.events);
  const dispatch = useDispatch();
    const totalEvents = useSelector((state) => state.search.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);

  useEffect(() => {
    dispatch(
      getSearchResults({
        query: searchState.query,
        postalCode: searchState.postalCode,
        dateRange: searchState.dateRange,
        page: page,
      })
    );
  }, [
    dispatch,
    searchState.query,
    searchState.postalCode,
    searchState.dateRange,
    page
  ]);

  const handleAddEvents = async (eventId) => {
    if(auth.currentUser){
      dispatch(handleEventAsync(eventId));
    } else{
      dispatch(handleEvents(eventId));
    } 
  };

  const handleFilter = () => {
    setPage(1);
    dispatch(getAllEvents({ type: filter, page: 1 }));
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
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

      {events?.length > 0 && (
        <Container
          className="d-flex justify-content-center"
          style={{ marginTop: "2rem" }}
        >
          <PrevNext
            currentPage={page}
            totalPages={totalPages}
            totalEvents={totalEvents}
            onPageClick={handlePageClick}
            onNextClick={handleNextPage}
            onPreviousClick={handlePreviousPage}
          />
        </Container>
      )}
    </>
  );
};

export default SearchResults;
