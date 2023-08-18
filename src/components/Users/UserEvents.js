import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { getSingleEvent } from "../../store/singleEventSlice";
import BigCalendar from "./BigCalendar";
import { Button, Image, Container, Row, Col } from "react-bootstrap";

// Component for displaying user's saved events
const UserEvents = () => {
  // Fetch current logged-in user
  const user = auth.currentUser;
  
  // Fetch saved event IDs from the state using Redux
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();

  // State variables to hold saved events and logged in user's events
  const [savedEvents, setSavedEvents] = useState([]);
  const [loginUserEvents, setLoginUserEvents] = useState([]);

  // Effect hook to fetch logged-in user's saved events from the database
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          // If user's data exists in the Firestore, fetch the events
          if (docSnap.exists()) {
            const userEventData = await Promise.all(
              docSnap.data().events.map(async (eventId) => {
                const eventDetails = await dispatch(getSingleEvent(eventId));
                return eventDetails.payload;
              })
            );
            // Filter out undefined or errored events
            setLoginUserEvents(
              userEventData.filter(
                (event) => event !== undefined && event.status !== 400
              )
            );
          } else {
            console.log("Document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserData();
    }
  }, []);

  // Effect hook to fetch saved events for users that are not logged in
  useEffect(() => {
    if (!user) {
      const fetchSavedEvents = async () => {
        const eventsData = await Promise.all(
          savedEventIds.map(async (eventId) => {
            const eventDetails = await dispatch(getSingleEvent(eventId));
            return eventDetails.payload;
          })
        );
        // Filter out undefined or errored events
        setSavedEvents(
          eventsData.filter(
            (event) => event !== undefined && event.status !== 400
          )
        );
      };

      fetchSavedEvents();
    }
  }, [dispatch, savedEventIds, user]);

  // Function to handle event removal for non-logged in users
  const handleDeleteEvent = (eventId) => {
    dispatch(handleEvents(eventId));
  };

  // Function to handle event removal for logged-in users
  const handleDeleteLoginUserEvent = async (eventId) => {
    await dispatch(handleEventAsync(eventId));
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    // Filter out the removed event
    const updatedEvents = loginUserEvents.filter(
      (event) => event.id !== eventId
    );

    // Update the user's events in Firestore
    await updateDoc(userDocRef, {
      events: updatedEvents.map((event) => event.id),
    });

    // Update the state with the filtered events
    setLoginUserEvents(updatedEvents);
  };

  return (
    <div>
      <h1>Your Saved Events</h1>
      <ul>
        {user
          ? loginUserEvents.map((event) => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>Date: {event.datetime_utc}</p>
                <p>Venue: {event.venue?.name_v2}</p>
                <button onClick={() => handleDeleteLoginUserEvent(event.id)}>
                  Remove
                </button>
              </li>
            ))
          : savedEvents.map((event) => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>Date: {event.datetime_local}</p>
                <p>Venue: {event.venue?.name_v2}</p>
                <button onClick={() => handleDeleteEvent(event.id)}>
                  Remove
                </button>
              </li>
            ))}
      </ul>
      <BigCalendar savedEvents={user ? loginUserEvents : savedEvents} />
    </div>
  );
};

export default UserEvents;
