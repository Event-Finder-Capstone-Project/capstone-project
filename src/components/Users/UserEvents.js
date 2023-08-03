import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { deleteEvent } from "../../store/eventsSlice";
import { getSingleEvent } from "../../store/singleEventSlice";
import CalendarEvents from "./CalendarEvents";

const UserEvents = () => {
  const user = auth.currentUser;
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();

  const [savedEvents, setSavedEvents] = useState([]);
  const [loginUser, setLoginUser] = useState({});
  const [loginUserEvents, setLoginUserEvents] = useState([]);

  useEffect(() => {
    // Fetch detailed event information for each saved eventId
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
  }, [dispatch, savedEventIds]);

  useEffect(() => {
    // Function to fetch user data from Firestore based on UID
    const fetchLoginUserEvents = async () => {
       
      try {
        if (user) {
          const userId = auth.currentUser.uid;
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const eventsData = await Promise.all(
              docSnap.data().events.map(async (eventId) => {
                const eventDetails = await dispatch(getSingleEvent(eventId));
                return eventDetails.payload;
              })
            );
            setLoginUser(docSnap.data());
            setLoginUserEvents(eventsData);
          } else {
            console.log("Document does not exist");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    fetchLoginUserEvents();
  }, [user,dispatch]);
  

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
  };
  const handleDeleteLoginUserEvent = async (eventId) => {
    try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, "users", userId);

        // Remove the event ID from the user's events array in Firestore
        const updatedEvents = loginUser.events.filter((id) => id !== eventId);
    
        await updateDoc(userDocRef, {
            events: updatedEvents,
        });

        // Update the local state
        setLoginUser({
            ...loginUser,
            events: updatedEvents,
        });
    } catch (error) {
        console.error("Error deleting user event:", error);
    }
};

  return (
    <div>
      <h2>Your Saved Events</h2>
      <ul>
        {user
          ? // Display events from user's collection if logged in
            loginUserEvents?.map((event) => (
                <li key={event.id}>
                <h3>{event.title}</h3>
                <p>Date: {event.datetime_utc}</p>
                <p>Venue: {event.venue?.name_v2}</p>
                <button onClick={() => handleDeleteLoginUserEvent(event.id)}>
                  Remove
                </button>
              </li>
            ))
            
          : // Display events from local storage if guest
            savedEvents.map((event) => (
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
      <CalendarEvents/>
    </div>
  );
};

export default UserEvents;

