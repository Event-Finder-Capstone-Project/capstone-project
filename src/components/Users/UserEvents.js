import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteEvent } from "../../store/eventsSlice";
import { getSingleEvent } from "../../store/singleEventSlice";

const UserEvents = () => {
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();

  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    // Fetch detailed event information for each saved eventId
    const fetchSavedEvents = async () => {
      const eventsData = [];
      for (const eventId of savedEventIds) {
        const eventDetails = await dispatch(getSingleEvent(eventId));
        eventsData.push(eventDetails.payload);
      }
      setSavedEvents(eventsData);
    };

    fetchSavedEvents();
  }, [dispatch, savedEventIds]);

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
  };

  return (
    <div>
      <h2>Your Saved Events</h2>
      <ul>
        {savedEvents.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>Date: {event.datetime_utc}</p>
            <p>Venue: {event.venue?.name_v2}</p>
            <button onClick={() => handleDeleteEvent(event.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserEvents;

