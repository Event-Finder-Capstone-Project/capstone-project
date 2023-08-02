import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const AllEvents = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const handleAddToCollection = async (eventId) => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);

      // Add the event ID to the user's events array
      await updateDoc(userDocRef, {
        events: [...userEvents, eventId],
      });

      // Update the local state
      setUserEvents([...userEvents, eventId]);
    }
  };

  const events = useSelector(selectEvents);

  const handleFilter = () => {
    setPage(1);
    dispatch(getAllEvents({ type: filter, page: 1 }));
  };
  //this filter probably should be a separate component
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
              {!userEvents.includes(event.id) && (
                <button onClick={() => handleAddToCollection(event.id)}>
                  Add Event
                </button>
              )}
            </div>
          ))
        ) : (
          <p>{filter === "" ? "Loading events..." : "Events not found 😢"}</p>
        )}
      </div>
      <div className="pageButtons">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}>
          Previous
        </button>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>
          Next
        </button>
      </div>
    </>
  );
};

export default AllEvents;
