import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import {
  selectedHoveredEventId,
  clearHoveredEventId,
} from "../../store/hoverSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { Nav, Row, Container, Button, Col, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { TestMap, NewCarousel, Carousel } from "../";
import { eventEmitter } from "../App";
import PrevNext from "./PrevNext";
import "../style/index.css";

const Weekend = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [rerender, setRerender] = useState(false);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");
  const totalEvents = useSelector((state) => state.allEvents.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);
  const savedEventIds = useSelector((state) => state.events);

  const dispatch = useDispatch();

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
    if ((storedCity && storedState) || (latitude && longitude)) {
      const today = new Date();
      const startOfWeek = new Date(today);
      const endOfWeek = new Date(today);

      const dayOfWeek = today.getDay();

      const daysUntilFriday = 5 - dayOfWeek;
      const daysUntilSunday = 7 - dayOfWeek + 1;

      startOfWeek.setDate(today.getDate() + daysUntilFriday);
      endOfWeek.setDate(today.getDate() + daysUntilSunday);

      const fetchEventData = async () => {
        let eventDataParams = {
          type: filter,
          page: page,
          dateRange: {
            startDate: startOfWeek.toISOString().split("T")[0],
            endDate: endOfWeek.toISOString().split("T")[0],
          },
        };

        if (storedCity && storedState) {
          eventDataParams = {
            ...eventDataParams,
            venue: {
              city: storedCity,
              state: storedState,
            },
          };
        } else if (latitude && longitude) {
          eventDataParams = {
            ...eventDataParams,
            latitude: latitude,
            longitude: longitude,
          };
        }
        console.log("event data: ", eventDataParams);
        dispatch(getAllEvents(eventDataParams));
      };

      fetchEventData();
    }
  }, [dispatch, filter, page, storedCity, storedState, latitude, longitude]);

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
      } else {
        setUserEvents(savedEventIds || []);
      }
    };
    fetchEventsData();
    fetchUserEvents();
  }, []);

  //handle add and remove event use icon
  const handleAddEvents = (eventId) => {
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
  };

  const handleFilter = () => {
    setPage(1);
    dispatch(getAllEvents({ type: filter, page: 1 }));
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleMouseEnter = (eventId) => {
    setHoveredEventId(eventId);
    dispatch(selectedHoveredEventId(eventId));
  };

  const handleMouseLeave = () => {
    setHoveredEventId(null);
    dispatch(clearHoveredEventId());
  };

  return (
    <>
      <h1 style={{ marginTop: "1rem" }}>
        {" "}
        Happening This Weekend {storedCity ? `in ${storedCity}` : ""}
      </h1>

      <Container
        fluid="lg"
        class="text-center"
        className="all-events-container"
        style={{ marginTop: "1rem" }}
      >
        <Container
          className="filter"
          style={{
            marginTop: ".3rem",
            marginBottom: "1rem",
            marginLeft: ".5rem",
          }}
        >
          <Form.Label
            style={{
              width: "100px",
              fontSize: "18px",
              paddingTop: "7px",
              whiteSpace: "nowrap",
              marginRight: ".7rem",
            }}
          >
            Event Type
          </Form.Label>
          <Form.Select
            style={{ height: "38px", minWidth: "100px", maxWidth: "200px" }}
            variant="light"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">None</option>
            {eventsData.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </Form.Select>
        </Container>

        <Container>
          <Row xs={1} sm={1} md={2}>
            <Col style={{ marginBottom: "2rem" }} className="stickyMaps">
              <TestMap />
            </Col>
            <Col style={{ position: "relative" }}>
              <Container>
                {events?.length ? (
                  events.map((event) => (
                    <Row
                      xs={1}
                      md={2}
                      onMouseEnter={() => handleMouseEnter(event.id)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        marginBottom: "2rem",
                        minWidth: "100%",
                        backgroundColor: "slategray",
                      }}
                    >
                      <LinkContainer to={`/events/${event.id}`}>
                        <Nav.Link>
                          <Col>
                            <img
                              style={{
                                minWidth: "100%",
                                minHeight: "100%",
                              }}
                              src={event.performers[0].image}
                              alt={event.name}
                            />
                          </Col>
                        </Nav.Link>
                      </LinkContainer>

                      <Col
                        style={{
                          backgroundColor:
                            hoveredEventId === event.id
                              ? "darkorange"
                              : "slategray",
                          transition: "background-color 0.3s ease-in-out",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          paddingBottom: ".5rem",

                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          alignText: "right",
                          overflow: "hidden",
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
                          <FontAwesomeIcon
                            icon={
                              userEvents.includes(event.id)
                                ? solidStar
                                : outlineStar
                            }
                          />
                        </Button>
                        <LinkContainer to={`/events/${event.id}`}>
                          <Nav.Link>
                            <h4
                              style={{
                                fontSize: "20px",
                                color: "white",
                                alignText: "right",
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
                ) : (
                  <p>{!events?.length ? "No events found!" : ""}</p>
                )}
              </Container>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container
        className="d-flex justify-content-center"
        style={{ marginTop: "2rem" }}
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

export default Weekend;
