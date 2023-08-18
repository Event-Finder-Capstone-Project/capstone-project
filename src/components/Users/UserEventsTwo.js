import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { getSingleEvent } from "../../store/singleEventSlice";
import BigCalendar from "./BigCalendar";
import { Button, Container, Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// Define the UserEventsTwo component
const UserEventsTwo = () => {
  // Get the currently logged-in user
  const user = auth.currentUser;

  // Get saved event IDs from the Redux state
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();

  // Local state to keep track of events for both logged-in users and guests
  const [savedEvents, setSavedEvents] = useState([]);
  const [loginUserEvents, setLoginUserEvents] = useState([]);

  // Fetch user data if a user is logged in
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          // Fetching user's saved events from Firestore
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

            // Filter out any undefined events or events with status 400
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

  // Fetch saved events for guests (non-logged-in users)
  useEffect(() => {
    if (!user) {
      const fetchSavedEvents = async () => {
        const eventsData = await Promise.all(
          savedEventIds.map(async (eventId) => {
            const eventDetails = await dispatch(getSingleEvent(eventId));
            return eventDetails.payload;
          })
        );

        // Filter out any undefined events or events with status 400
        setSavedEvents(
          eventsData.filter(
            (event) => event !== undefined && event.status !== 400
          )
        );
      };

      fetchSavedEvents();
    }
  }, [dispatch, savedEventIds, user]);

  // Handle deleting an event for guests
  const handleDeleteEvent = (eventId) => {
    dispatch(handleEvents(eventId));
  };

  // Handle deleting an event for a logged-in user
  const handleDeleteLoginUserEvent = async (eventId) => {
    await dispatch(handleEventAsync(eventId));
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    const updatedEvents = loginUserEvents.filter(
      (event) => event.id !== eventId
    );

    // Update the user's saved events in Firestore
    await updateDoc(userDocRef, {
      events: updatedEvents.map((event) => event.id),
    });

    // Update the local state to reflect the removal
    setLoginUserEvents(updatedEvents);
  };
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = new Date(dateString).toLocaleTimeString(
      undefined,
      optionsTime
    );
    return `${formattedDate} at ${formattedTime}`;
  }

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", marginTop: "1rem" }}>
        Your Saved Events
      </h1>
      <Container>
        <Row xs={1} md={1} lg={1} xl={2} className="user-events-container">
          <Row className="userItems" xs={2} md={2} lg={2} xl={1}>
            {user
              ? loginUserEvents.map((event) => (
                  <div>
                    <Container
                      to={`/events/${event.id}`}
                      style={{
                        marginBottom: "1rem",
                        columnGap: "1rem",
                        backgroundColor: "slategray",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      key={event.id}
                    >
                      <LinkContainer to={`/events/${event.id}`}>
                        <Nav.Link>
                          <h3>{event.title}</h3>
                          <h5>{formatDate(event.datetime_local)}</h5>
                          <h6>Venue: {event.venue?.name_v2}</h6>
                        </Nav.Link>
                      </LinkContainer>
                      <Button
                        className="removeEventButton"
                        style={{
                          backgroundColor: "darkorange",
                          color: "black",
                          border: "none",
                          marginBottom: ".5rem",
                        }}
                        onClick={() => handleDeleteLoginUserEvent(event.id)}
                      >
                        Remove
                      </Button>
                    </Container>{" "}
                  </div>
                ))
              : savedEvents.map((event) => (
                  <div style={{ display: "flex" }}>
                    <Container
                      style={{
                        marginBottom: "1rem",
                        columnGap: "1rem",
                        backgroundColor: "slategray",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      key={event.id}
                    >
                      <h3>{event.title}</h3>
                      <h5>{formatDate(event.datetime_local)}</h5>
                      <h6>Venue: {event.venue?.name_v2}</h6>

                      <Button
                        style={{
                          backgroundColor: "darkorange",
                          color: "black",
                          border: "none",
                          marginBottom: ".5rem",
                        }}
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Remove
                      </Button>
                    </Container>{" "}
                  </div>
                ))}
          </Row>
          <BigCalendar savedEvents={user ? loginUserEvents : savedEvents} />
        </Row>
      </Container>
    </div>
  );
};

export default UserEventsTwo;
