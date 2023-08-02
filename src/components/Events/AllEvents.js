import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const AllEvents = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const dispatch = useDispatch();

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
    if (latitude && longitude) {
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          latitude: latitude,
          longitude: longitude,
        })
      );
    }
  }, [dispatch, filter, page, latitude, longitude]);

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
            <option value="concert">Concerts</option>
            <option value="sports">Sporting Events</option>
            <option value="family">Family</option>
            <option value="comedy">Comedy</option>
            <option value="dance_performance_tour">Dance</option>
          </select>
        </div>
        <div>
          <label>Enter Zip Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <Button size="sm" onClick={handleFilter}>
            Filter
          </Button>
        </div>
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

export default AllEvents;
