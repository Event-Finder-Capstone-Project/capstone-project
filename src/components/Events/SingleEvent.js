import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/singleEventSlice";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import BackButton from "../BackButton";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button, Image, Container, Row, Col } from "react-bootstrap";
import ShareEvent from "./ShareEvent";

const SingleEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [userEvents, setUserEvents] = useState([]);
  const savedEventIds = useSelector((state) => state.events);

  // Get reference to the event container element
  const eventContainer = document.getElementById("single-event-container");

  // Get location and query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter");
  const page = queryParams.get("page");

  // Fetch single event details and scroll to event container
  useEffect(() => {
    dispatch(getSingleEvent(id));
    if (eventContainer) {
      eventContainer.scrollIntoView({ behavior: "smooth" });
    }
  }, [dispatch, id, eventContainer]);

  // Get single event details from Redux state
  const event = useSelector((state) => state.singleEvent.singleEvent);

  // Format the event date and time
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

  // Fetch user's saved events from Firebase or local storage
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserEvents(userData.events || []);
        }
      } else {
        setUserEvents(savedEventIds || []);
      }
    };
    fetchUserEvents();
  }, []);

  // Handle adding/removing an event to/from user's collection
  const handleAddEvents = async (eventId) => {
    if (event) {
      try {
        if (auth.currentUser) {
          dispatch(handleEventAsync(eventId));
        } else {
          dispatch(handleEvents(eventId));
        }

        // Toggle the event in userEvents state
        if (userEvents.includes(eventId)) {
          setUserEvents(userEvents.filter((id) => id !== eventId));
        } else {
          setUserEvents([...userEvents, eventId]);
        }
      } catch (error) {
        console.error("Error adding event to user collection:", error);
      }
    }
  };

  // Handle clicking on a link to the event venue
  const handleLink = () => {
    window.open(event.venue.url);
  };

  return (
    <Container
      style={{ marginTop: "3rem" }}
      fluid="lg"
      className="event-details"
    >
      {event ? (
        <Row
          xs={1}
          md={2}
          lg={2}
          className="single-event-container"
          id="single-event-container"
        >
          <Col>
            <Image
              src={event.performers[0].image}
              className="event-img"
              alt=""
              fluid
              width="100%"
            />
          </Col>
          {event.venue ? (
            <Col>
              <div>
                <h1>{event.title}</h1>
                <h4>{formatDate(event.datetime_local)}</h4>
                <Row style={{ marginTop: "1rem" }}>
                  <Col>
                    <h5>{event.venue.name_v2}</h5>
                  </Col>
                  <Col>
                    <h5>
                      <p>{event.venue.address}</p>
                      {event.venue.city}, {event.venue.state}
                    </h5>
                  </Col>
                </Row>

                <Row style={{ marginTop: "2rem" }}>
                  <Col>
                    <h5>About this Event</h5>

                    <p>
                      This event, organized by {event.venue.name_v2} is a{" "}
                      {event.type} featuring{" "}
                      {event.performers.length <= 1
                        ? `${event.performers[0].name}`
                        : event.performers.map((e, index) => {
                            if (index === 0) {
                              return e.name;
                            } else if (index === event.performers.length - 1) {
                              return ` and ${e.name}`;
                            } else {
                              return `${e.name}, `;
                            }
                          })}
                      . Come enjoy this grand experience, bring your friends, or
                      don't! Take yourself out on a date! It'll be a blast,
                      we're sure. Tickets can be purchased through the link
                      below.
                    </p>
                  </Col>
                </Row>
                {userEvents.includes(event.id) ? (
                  <>
                    <p>Successfully added to your events!</p>
                    <Button
                      style={{ marginRight: "1rem", marginBottom: "1rem" }}
                      variant="secondary"
                      onClick={() => handleAddEvents(event.id)}
                    >
                      Remove Event
                    </Button>
                  </>
                ) : (
                  <Button
                    style={{ marginRight: "1rem", marginBottom: "1rem" }}
                    variant="secondary"
                    onClick={() => handleAddEvents(event.id)}
                  >
                    Add Event
                  </Button>
                )}

                <Button
                  style={{ marginRight: "1rem", marginBottom: "1rem" }}
                  variant="secondary"
                  onClick={handleLink}
                >
                  Buy Tickets Here
                </Button>
                <BackButton page={page} filter={filter} />
                <ShareEvent eventId={event.id} />
              </div>
            </Col>
          ) : null}
        </Row>
      ) : (
        <p className="loading-text">Loading event...</p>
      )}
    </Container>
  );
};

export default SingleEvent;
