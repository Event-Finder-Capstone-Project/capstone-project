import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { getSingleEvent } from "../../store/singleEventSlice";
import BigCalendar from "./BigCalendar";
import { Button, Image, Container, Row, Col } from "react-bootstrap";

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

  useEffect(() => {
    if (!user) {
      const fetchSavedEvents = async () => {
        const eventsData = await Promise.all(
          savedEventIds.map(async (eventId) => {
            const eventDetails = await dispatch(getSingleEvent(eventId));
            return eventDetails.payload;
          })
        );
        setSavedEvents(
          eventsData.filter(
            (event) => event !== undefined && event.status !== 400
          )
        );
      };

      fetchSavedEvents();
    }
  }, [dispatch, savedEventIds, user]);

  const handleDeleteEvent = (eventId) => {
    dispatch(handleEvents(eventId));
  };

  const handleDeleteLoginUserEvent = async (eventId) => {
    await dispatch(handleEventAsync(eventId));
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    const updatedEvents = loginUserEvents.filter(
      (event) => event.id !== eventId
    );

    await updateDoc(userDocRef, {
      events: updatedEvents.map((event) => event.id),
    });

    setLoginUserEvents(updatedEvents);
  };

  const checkEventsOneDayAway = (events) => {
    const currentTime = new Date().getTime();
    events.forEach((event) => {
      const eventTime = new Date(event.datetime_local).getTime();
      const timeDifference = eventTime - currentTime;

      if (
        timeDifference <= 24 * 60 * 60 * 1000 &&
        timeDifference > 23.5 * 60 * 60 * 1000
      ) {
        // between 23.5 to 24 hours
        new Notification(`Event Reminder: ${event.title} is tomorrow!`);
      }
    });
  };

  useEffect(() => {
    if (user) {
      checkEventsOneDayAway(loginUserEvents);
    } else {
      checkEventsOneDayAway(savedEvents);
    }
    const intervalId = setInterval(() => {
      if (user) {
        checkEventsOneDayAway(loginUserEvents);
      } else {
        checkEventsOneDayAway(savedEvents);
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [loginUserEvents, savedEvents, user]);

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
