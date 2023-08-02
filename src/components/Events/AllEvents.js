import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import CalendarEvents from "./CalendarEvents";

const AllEvents = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEvents({ type: filter, page: page }));
  }, [dispatch, filter, page]);

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
        <button onClick={handleFilter}>Filter</button>
      </div>

      <div className="all-events-container">
        {events ? (
          events.map((event) => (
            <div className="event-container" key={event.id}>
              <NavLink to={`/events/${event.id}`}>
                <p id="event-name">{event.title}</p>
                <img
                  style={{ width: "200px" }}
                  src={event.performers[0].image}
                  alt={event.name}
                />
              </NavLink>
            </div>
          ))
        ) : (
          <p>Loading events...</p>
        )}
      </div>
      <div className="pageButtons">
        <button
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <button onClick={handleNextPage}>
          Next
        </button>
      </div>
      <div>
        <CalendarEvents></CalendarEvents>
      </div>
    </>
  );
};

export default AllEvents;
