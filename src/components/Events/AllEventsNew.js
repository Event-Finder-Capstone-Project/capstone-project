import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { addEvents } from "../../store/eventsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import Toastify from "toastify-js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Nav, Row, Col, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { TestMap, NewCarousel, Carousel } from "../";
import { eventEmitter } from "../App";
import PrevNext from "./PrevNext";
const AllEventsNew = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [clickedEvents, setClickedEvents] = useState([]);
  const [rerender, setRerender] = useState(false);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");
  const dispatch = useDispatch();
  const totalEvents = useSelector((state) => state.allEvents.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);

  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);
  useEffect(() => {
    const cityChangedListener = (data) => {
      setRerender(!rerender);
    };
    eventEmitter.on("cityChanged", cityChangedListener);
    return () => {
      eventEmitter.off("cityChanged", cityChangedListener);
    };
  }, [rerender]);
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const events = useSelector(selectEvents);
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);
  useEffect(() => {
    if (storedCity && storedState) {
      const venue = {
        city: storedCity,
        state: storedState,
      };
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          venue: venue,
        })
      );
    } else {
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          latitude: latitude,
          longitude: longitude,
        })
      );
    }
  }, [dispatch, filter, page, latitude, longitude, storedCity, storedState]);
  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const eventsQuerySnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsQuerySnapshot.docs.map(
          (doc) => doc.data().type
        );
        setEventsData(eventsData);
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };
    const fetchUserEvents = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserEvents(userData.events || []);
        }
      }
    };
    fetchEventsData();
    fetchUserEvents();
  }, []);
  const handleAddEvents = async (eventId) => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      if (userEvents.includes(eventId)) {
        const updatedEvents = userEvents.filter((id) => id !== eventId);
        await updateDoc(userDocRef, {
          events: updatedEvents,
        });
        setUserEvents(updatedEvents);
      } else {
        await updateDoc(userDocRef, {
          events: [...userEvents, eventId],
        });
        setUserEvents([...userEvents, eventId]);
      }
    } else {
      dispatch(addEvents(eventId));
    }
    setClickedEvents([...clickedEvents, eventId]);
  };
  const handleFilter = () => {
    setPage(1);
    dispatch(getAllEvents({ type: filter, page: 1 }));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <>
      <h1> Popular in your area </h1>
      <NewCarousel />
      <Container
        fluid="true"
        class="text-center"
        className="all-events-container"
        style={{
          marginTop: "3rem",
          marginLeft: "0px",
          marginRight: "0px",
          width: "100%",
        }}
      >
        <div className="filter-container">
          <Container
            style={{ marginTop: ".5rem", marginBottom: "1rem" }}
            className="d-flex justify-content-center"
          >
            <h5
              style={{
                paddingTop: ".3rem",
              }}
            >
              Event Type
            </h5>
            <select
              style={{ height: "35px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">None</option>
              {eventsData.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
          </Container>
        </div>

        <Row xs={1} sm={1} md={2}>
          <Col style={{ width: "50%" }}>
            <TestMap />
          </Col>
          <Col style={{ width: "50%" }}>
            {events?.length
              ? events.map((event) => (
                  <Row
                    xs={1}
                    md={2}
                    style={{
                      marginBottom: "2rem",
                      marginRight: "0px",
                    }}
                    fluid={true}
                  >
                    <LinkContainer to={`/events/${event.id}`}>
                      <Nav.Link>
                        <Col style={{ backgroundColor: "slategray" }}>
                          <img
                            sm={{ maxWidth: "200px", maxHeight: "200px" }}
                            xs={{
                              maxWidth: "200px",
                              maxHeight: "100%",
                            }}
                            src={event.performers[0].image}
                            alt={event.name}
                          />
                        </Col>
                      </Nav.Link>
                    </LinkContainer>

                    <Col
                      style={{
                        backgroundColor: "slateGrey",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        variant="outline"
                        style={{
                          border: "none",
                          fontSize: "32px",
                        }}
                        onClick={() => handleAddEvents(event.id)}
                      >
                        {!clickedEvents.includes(event.id) &&
                        !userEvents.includes(event.id) ? (
                          <FontAwesomeIcon icon={outlineStar} />
                        ) : (
                          <FontAwesomeIcon icon={solidStar} />
                        )}
                      </Button>
                      <LinkContainer to={`/events/${event.id}`}>
                        <Nav.Link>
                          <h4
                            xs={{
                              color: "white",
                              textAlign: "center",
                            }}
                            style={{
                              textAlign: "right",
                              fontSize: "20px",
                            }}
                            id="event-name"
                          >
                            {event.title}
                          </h4>
                        </Nav.Link>
                      </LinkContainer>
                    </Col>
                  </Row>
                ))
              : // <p>{!events?.length ? "No events found!" : ""}</p>
                null}
          </Col>
        </Row>
      </Container>
      <Container
        className="d-flex justify-content-center"
        style={{ alignContent: "center", marginTop: "2rem" }}
      >
        <PrevNext
          currentPage={page}
          totalPages={totalPages}
          totalEvents={totalEvents}
        onPageClick={handlePageClick}
        onNextClick={handleNextPage}
        onPreviousClick={handlePreviousPage}
      />
      </Container>
    </>
  );
};
export default AllEventsNew;
