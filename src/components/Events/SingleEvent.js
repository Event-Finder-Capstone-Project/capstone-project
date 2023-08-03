import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/singleEventSlice";
import BackButton from "../BackButton";
import { auth,db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";



const SingleEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isEventAdded, setIsEventAdded] = useState(false);

  useEffect(() => {
      dispatch(getSingleEvent(id));
  }, [dispatch, id]);

  const event = useSelector((state) => state.singleEvent.singleEvent);

  const formatDate = (datetime_utc) => {
    const eventDate = new Date(datetime_utc);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  const handleAddEvent = async () => {
    if (event) {
      try {
        const user = auth.currentUser; // Replace with your authentication object
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            // Check if the event ID is not already in the user's collection
            if (!userData.events.includes(event.id)) {
              // Add the event ID to the user's collection
              await setDoc(userDocRef, { events: [...userData.events, event.id] }, { merge: true });
              setIsEventAdded(true);
            }
          }
        }
      } catch (error) {
        console.error("Error adding event to user collection:", error);
      }
    }
  };

  return (
    <div className="event-details">
      {event ? (
        <div className="single-event-container">
          <h2>{event.title}</h2>
          <h3>{formatDate(event.datetime_utc)}</h3>
          <img src={event.performers[0].image} className="event-img" alt="" />
          {event.venue ? (
            <div>
              <h3>{event.venue.name_v2}</h3>
              <p>{event.venue.address}</p>
              <p>
                {event.venue.city}, {event.venue.state}
              </p>
            </div>
          ) : null}
  
          {isEventAdded ? (
            <p>Successfully added to your events!</p>
          ) : (
            <button onClick={handleAddEvent}>Add Event</button>
          )}
          <BackButton />
        </div>
      ) : (
        <p className="loading-text">Loading event...</p>
      )}
    </div>
  );
  
};

export default SingleEvent;
