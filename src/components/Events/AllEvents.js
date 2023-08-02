import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { NavLink } from "react-router-dom";

const AllEvents = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user's location:", error.message);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation || locationInput) {
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          latitude: userLocation?.latitude || undefined,
          longitude: userLocation?.longitude || undefined,
          location: locationInput || undefined,
        })
      );
    }
  }, [dispatch, filter, page, userLocation, locationInput]);


  useEffect(() => {
    dispatch(getAllEvents({ type: filter, page: page, geoip: userLocation || locationInput }));
  }, [dispatch, filter, page, userLocation, locationInput]);

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

  const handleLocationInputChange = (event) => {
    setLocationInput(event.target.value);
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
        <label>Enter Location</label>
        <input
          type="text"
          value={locationInput}
          onChange={handleLocationInputChange}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

        <button onClick={handleFilter}>Filter</button>
      </div>

      <div className="all-events-container">
        {events?.length ? (
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
          <p>{filter === "" ? "Loading events..." : "Events not found 😢"}</p>
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
    </>
  );
};

export default AllEvents;
