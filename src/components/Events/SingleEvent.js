import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/singleEventSlice";
import { handleEvents,handleEventAsync } from "../../store/eventsSlice";
import BackButton from "../BackButton";
import { auth} from "../../firebase";
import { Button, Image, Container, Row, Col } from "react-bootstrap";
import ShareEvent from "./ShareEvent";

const SingleEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isEventAdded, setIsEventAdded] = useState(false);
  const eventContainer = document.getElementById("single-event-container");

  useEffect(() => {
    dispatch(getSingleEvent(id));
    if (eventContainer) {
    eventContainer.scrollIntoView({ behavior: "smooth" });
    }
  }, [dispatch, id, eventContainer]);

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

  const handleAddEvents = async (eventId) => {
    if (event) {
      try {
        if(auth.currentUser){
          dispatch(handleEventAsync(eventId));
        } else{
          dispatch(handleEvents(eventId));
        } 
        setIsEventAdded(true);
      } catch (error) {
        console.error("Error adding event to user collection:", error);
      }
    }
  };

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
        <Row xs={1} md={2} lg={2} className="single-event-container" id="single-event-container">
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
                <h4>{formatDate(event.datetime_utc)}</h4>
                <Row style={{ marginTop: "1rem" }}>
                  <Col>
                    <h5>{event.venue.name_v2}</h5>
                  </Col>

                  <Col>
                    <h5>
                      {event.venue.address}
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
                        ? `${event.performers.name}`
                        : event.performers.map((e) => `${e.name}, `)}
                      . Come enjoy this grand experience, bring your friends, or
                      don't! Take yourself out on a date! It'll be a blast,
                      we're sure. Tickets can be purchased through the link
                      below.
                    </p>
                  </Col>
                </Row>
                {isEventAdded ? (
                  <p>Successfully added to your events!</p>
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
                <BackButton />
                <ShareEvent />
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
