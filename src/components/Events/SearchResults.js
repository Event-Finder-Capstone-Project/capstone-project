import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAllEvents } from "../../store/allEventsSlice";
import {
  selectedHoveredEventId,
  clearHoveredEventId,
} from "../../store/hoverSlice";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { Nav, Row, Container, Button, Col, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { getSearchResults, setDateRange } from "../../store/searchSlice";
import DatePicker from "../NavBar/SearchComponents/DatePicker";
import PrevNext from "./PrevNext";
import { TestMap } from "../";
import "../style/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import Aos from "aos";

const SearchResults = ({ eventsData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");
  const pageParam = queryParams.get("page");

  // State for filter and page parameters
  const [filter, setFilter] = useState(filterParam || "");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);

  // State for user events and hovered event
  const [userEvents, setUserEvents] = useState([]);
  const [hoveredEventId, setHoveredEventId] = useState(null);

  // State for scrolling to events container
  const [scrollToEvents, setScrollToEvents] = useState(false);

  // Redux state and dispatch
  const searchState = useSelector((state) => state.search);
  const events = useSelector((state) => state.search.events);
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const totalEvents = useSelector((state) => state.search.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);
  Aos.init();

  // Fetch search results based on query, date range, filter, and page
  useEffect(() => {
    dispatch(
      getSearchResults({
        query: searchState.query,
        dateRange: searchState.dateRange,
        page: page,
        type: filter,
      })
    );
  }, [dispatch, searchState.query, searchState.dateRange, page, filter]);

  // Fetch all events if filter is empty
  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);

  // Fetch user events from Firebase or local storage
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

  // Scroll to events container when scrollToEvents is true
  const eventsContainer = document.getElementById("resultsContainer");
  useEffect(() => {
    if (scrollToEvents) {
      if (eventsContainer) {
        eventsContainer.scrollIntoView({ behavior: "smooth" });
      }
      setScrollToEvents(false);
    }
  }, [scrollToEvents, eventsContainer]);

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

  // Handle filter change and reset page to 1
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Handle navigation to previous page
  const handlePreviousPage = () => {
    const newPage = Math.max(page - 1, 1);
    setPage(newPage);
    navigate(`/searchresults?filter=${filter}&page=${newPage}`);
    setScrollToEvents(true);
  };

  // Handle navigation to next page
  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    navigate(`/searchresults?filter=${filter}&page=${newPage}`);
    setScrollToEvents(true);
  };

  // Handle navigation to a specific page
  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    navigate(`/searchresults?filter=${filter}&page=${pageNumber}`);
    setScrollToEvents(true);
  };

  // Handle selection of date range
  const handleSelectDateRange = (dateRange) => {
    dispatch(setDateRange(dateRange));
  };

  // Handle mouse enter event on event card
  const handleMouseEnter = (eventId) => {
    setHoveredEventId(eventId);
    dispatch(selectedHoveredEventId(eventId));
  };

  // Handle mouse leave event on event card
  const handleMouseLeave = () => {
    setHoveredEventId(null);
    dispatch(clearHoveredEventId());
  };

  return (
    <>
      <h1>Search Results</h1>
      <Container className="resultsContainer" id="resultsContainer">
        <Container>
          <DatePicker onSelectDateRange={handleSelectDateRange} />
        </Container>
        <Container className="filter">
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
            style={{ height: "38px" }}
            className="filterDropdown"
            variant="light"
            value={filter}
            onChange={(e) => {
              handleFilterChange(e.target.value);
              navigate(`/searchresults?filter=${e.target.value}&page=1`);
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
                    data-aos="zoom-in"
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

      {events?.length > 0 && (
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
      )}
    </>
  );
};

export default SearchResults;
