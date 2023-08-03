import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/singleEventSlice";
import BackButton from "../BackButton";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Nav, Card, Button, Image, Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

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
              await setDoc(
                userDocRef,
                { events: [...userData.events, event.id] },
                { merge: true }
              );
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
    <Container fluid="lg" className="event-details">
      {event ? (
        <Row className="single-event-container">
          <Col>
            <Image
              src={event.performers[0].image}
              className="event-img"
              alt=""
              fluid
              width="90%"
            />
          </Col>
          {event.venue ? (
            <Col>
              <div>
                <h1>{event.title}</h1>
                <h4>{formatDate(event.datetime_utc)}</h4>
                <Row>
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

                <Row>
                  <Col>
                    <h5>About this Event</h5>

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed vel aliquam mauris. Nullam et est nec nisi venenatis
                      tempus. Integer vestibulum, dolor ut egestas laoreet,
                      turpis metus eleifend lorem, id fermentum sapien justo a
                      nulla. Ut euismod sapien eu justo convallis, nec
                      pellentesque lectus varius. Fusce luctus erat vel justo
                      porttitor, non aliquam turpis congue. Sed cursus mauris a
                      augue mollis, vel scelerisque mi vehicula. Nam ut sagittis
                      sapien. Suspendisse non mauris vitae massa ullamcorper
                      eleifend ac eu mi. Nulla facilisi.
                    </p>
                  </Col>
                </Row>
                {isEventAdded ? (
                  <p>Successfully added to your events!</p>
                ) : (
                  <button onClick={handleAddEvent}>Add Event</button>
                )}
                <BackButton />
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
