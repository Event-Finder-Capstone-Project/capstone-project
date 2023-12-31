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
import { Nav, Row, Container, Button, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import TestMap from "../Maps/TestMap";
import { eventEmitter } from "../App";
import PrevNext from "./PrevNext";
import "../style/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import Aos from "aos";

const Today = ({eventsData}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");
  const pageParam = queryParams.get("page");
  const [filter, setFilter] = useState(filterParam || "");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [userEvents, setUserEvents] = useState([]);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [rerender, setRerender] = useState(false);
  const savedEventIds = useSelector((state) => state.events);
  const totalEvents = useSelector((state) => state.allEvents.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);
  const [scrollToEvents, setScrollToEvents] = useState(false);
  const events = useSelector(selectEvents);
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  Aos.init();

  // Listen for city change events and trigger rerender
useEffect(() => {
  const cityChangedListener = (data) => {
    setRerender(!rerender);
  };
  eventEmitter.on("cityChanged", cityChangedListener);
  return () => {
    eventEmitter.off("cityChanged", cityChangedListener);
  };
}, [rerender]);

// Fetch and display event data based on location and filters
useEffect(() => {
  if ((storedCity && storedState) || (latitude && longitude)) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1);
    
    const fetchEventData = async () => {
      let eventDataParams = {
        type: filter,
        page: page,
        dateRange: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
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
      dispatch(getAllEvents(eventDataParams));
    };
    fetchEventData();
  }
}, [dispatch, filter, page, storedCity, storedState, latitude, longitude]);

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
}, [filter, page]);

// Handle adding/removing an event to/from user's collection
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

// Handle clicking on a page number
const handlePageClick = (pageNumber) => {
  setPage(pageNumber);
  navigate(`/today?filter=${filter}&page=${pageNumber}`);
  setScrollToEvents(true);
};

// Handle clicking on the "Previous" page button
const handlePreviousPage = () => {
  const newPage = Math.max(page - 1, 1);
  setPage(newPage);
  navigate(`/today?filter=${filter}&page=${newPage}`);
  setScrollToEvents(true);
};

// Handle clicking on the "Next" page button
const handleNextPage = () => {
  const newPage = page + 1;
  setPage(newPage);
  navigate(`/today?filter=${filter}&page=${newPage}`);
  setScrollToEvents(true);
};

// Handle mouse entering an event card
const handleMouseEnter = (eventId) => {
  setHoveredEventId(eventId);
  dispatch(selectedHoveredEventId(eventId));
};

// Handle changing the event filter
const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  setPage(1);
};

// Handle mouse leaving an event card
const handleMouseLeave = () => {
  setHoveredEventId(null);
  dispatch(clearHoveredEventId());
};

// Get reference to the events container element
const eventsContainer = document.getElementById("all-events-container");

// Scroll to the events container if scrollToEvents is true
useEffect(() => {
  if (scrollToEvents) {
    if (eventsContainer) {
      eventsContainer.scrollIntoView({ behavior: "smooth" });
    }
    setScrollToEvents(false);
  }
}, [scrollToEvents, eventsContainer]);

  return (
    <>
      <h1 style={{ marginTop: "1rem" }}>
        {" "}
        Happening Today {storedCity ? `in ${storedCity}` : ""}
      </h1>
      <Container
        fluid="lg"
        class="text-center"
        className="all-events-container"
        style={{ marginTop: "1rem" }}
      >
        <div className="filter-container">
          <Container
            style={{
              marginTop: ".5rem",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <h5
              style={{
                paddingTop: ".3rem",
                marginRight: "1rem",
              }}
            >
              Event Type
            </h5>
            <select
              style={{ height: "35px" }}
              value={filter}
              onChange={(e) => {
                handleFilterChange(e.target.value);
                navigate(`/today?filter=${e.target.value}&page=1`);
              }}
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
        <Container>
          <Row xs={1} sm={1} md={2}>
            <Col style={{ marginBottom: "2rem" }} className="stickyMaps">
              <TestMap />
            </Col>
            <Col style={{ position: "relative" }}>
              <Container
               id="all-events-container"
               >
                {events?.length ? (
                  events.map((event) => (
                    <Row data-aos="zoom-in"
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
export default Today;
