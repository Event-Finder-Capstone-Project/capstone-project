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
import { doc, getDoc } from "firebase/firestore";
import { LinkContainer } from "react-router-bootstrap";
import { TestMap, NewCarousel } from "../";
import { eventEmitter } from "../App";
import PrevNext from "./PrevNext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Nav,
  Row,
  Col,
  Form,
  Container,
  Button,
} from "react-bootstrap";
import Aos from "aos";

const AllEventsNew = ({ eventsData }) => {
  const [userEvents, setUserEvents] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");
  const savedEventIds = useSelector((state) => state.events);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");
  const pageParam = queryParams.get("page");
  const [filter, setFilter] = useState(filterParam || "");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [scrollToEvents, setScrollToEvents] = useState(false);
  const totalEvents = useSelector((state) => state.allEvents.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);
  const events = useSelector(selectEvents);
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);
  const scrollPosition = localStorage.getItem("scrollPosition");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  Aos.init();
  
  // Render when getting all events by event type
  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);

  // Render when the user's location is set or changed
  useEffect(() => {
    const cityChangedListener = (data) => {
      setRerender(!rerender);
    };
    eventEmitter.on("cityChanged", cityChangedListener);
    return () => {
      eventEmitter.off("cityChanged", cityChangedListener);
    };
  }, [rerender]);

  // dispatch the type, page and location to alleventsSlice
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
      if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
      }
    } else {
      dispatch(
        getAllEvents({
          type: filter,
          page: page,
          latitude: latitude,
          longitude: longitude,
        })
      );
      if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [dispatch, filter, page, latitude, longitude, storedCity, storedState]);


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

  // Save scroll position to local storage on scroll
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to events container if scrollToEvents is true
  useEffect(() => {
    if (scrollToEvents) {
      const eventsContainer = document.getElementById("all-events-container");
      eventsContainer.scrollIntoView({ behavior: "smooth" });
      setScrollToEvents(false);
    }
  }, [scrollToEvents]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Handle previous page navigation
  const handlePreviousPage = () => {
    const newPage = Math.max(page - 1, 1);
    setPage(newPage);
    navigate(`/?filter=${filter}&page=${newPage}`);
    setScrollToEvents(true);
  };

  // Handle next page navigation
  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    navigate(`/?filter=${filter}&page=${newPage}`);
    setScrollToEvents(true);
  };

  // Handle page click
  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    navigate(`/?filter=${filter}&page=${pageNumber}`);
    setScrollToEvents(true);
  };

  // set state when hover on event card
  const handleMouseEnter = (eventId) => {
    setHoveredEventId(eventId);
    dispatch(selectedHoveredEventId(eventId));
  };

// Clear state when hovering off an event card
  const handleMouseLeave = () => {
    setHoveredEventId(null);
    dispatch(clearHoveredEventId());
  };

  return (
    <>
      <h1> Popular {storedCity ? `in ${storedCity}` : "in your area"}</h1>
      <Container>
        <NewCarousel />
      </Container>
      <Container
        class="text-center"
        className="all-events-container"
        id="all-events-container"
        style={{
          marginTop: "1rem",
          minWidth: "100%",
        }}
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
              paddingTop: "5px",
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
            onChange={(e) => {
              handleFilterChange(e.target.value);
              navigate(`/?filter=${e.target.value}`);
            }}
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
                    <Row data-aos="zoom-in"
                      xs={1}
                      md={2}
                      className="mb-4 bg-slategray transition"
                      onMouseEnter={() => handleMouseEnter(event.id)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        marginBottom: "2rem",
                        minWidth: "100%",
                        backgroundColor: "slategray",
                      }}
                    >
                      <LinkContainer 
                        to={{
                          pathname: `/events/${event.id}`,
                          search: `?filter=${filter}&page=${page}`,
                        }}
                      >
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
                            className={`star-icon ${
                              userEvents.includes(event.id) ? "active" : ""
                            }`}
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

        <Container
          className="d-flex justify-content-center"
          style={{ alignContent: "center" }}
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
      </Container>
    </>
  );
};
export default AllEventsNew;
