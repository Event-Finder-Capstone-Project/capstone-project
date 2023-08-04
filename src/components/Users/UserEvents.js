import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteEvent } from "../../store/eventsSlice";
import { getSingleEvent } from "../../store/singleEventSlice";
import CalendarEvents from "./CalendarEvents";

const UserEvents = () => {
  const user = auth.currentUser;
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();

  const [savedEvents, setSavedEvents] = useState([]);
  const [loginUserEvents, setLoginUserEvents] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userEventData = await Promise.all(
              docSnap.data().events.map(async (eventId) => {
                const eventDetails = await dispatch(getSingleEvent(eventId));
                return eventDetails.payload;
              })
            );
            setLoginUserEvents(userEventData);
          } else {
            console.log("Document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserData();
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) {
      const fetchSavedEvents = async () => {
        const eventsData = await Promise.all(
          savedEventIds.map(async (eventId) => {
            const eventDetails = await dispatch(getSingleEvent(eventId));
            return eventDetails.payload;
          })
        );
        setSavedEvents(eventsData);
      };

      fetchSavedEvents();
    }
  }, [dispatch, savedEventIds, user]);

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
  };

  const handleDeleteLoginUserEvent = async (eventId) => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);

      const updatedEvents = loginUserEvents.filter((event) => event.id !== eventId);

      await updateDoc(userDocRef, {
        events: updatedEvents.map((event) => event.id),
      });

      setLoginUserEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting user event:", error);
    }
  };

  return (
    <div>
      <h2>Your Saved Events</h2>
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
                <p>Date: {event.datetime_utc}</p>
                <p>Venue: {event.venue?.name_v2}</p>
                <button onClick={() => handleDeleteEvent(event.id)}>
                  Remove
                </button>
              </li>
            ))}
      </ul>
      <CalendarEvents savedEvents={savedEvents} />
    </div>
  );
};

export default UserEvents;


