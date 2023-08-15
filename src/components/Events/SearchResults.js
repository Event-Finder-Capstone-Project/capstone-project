import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAllEvents } from "../../store/allEventsSlice";

import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import {
  Nav,
  Row,
  Container,
  Button,
  Col,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { getSearchResults, setDateRange } from "../../store/searchSlice";
import DatePicker from "../NavBar/SearchComponents/DatePicker";
import PrevNext from "./PrevNext";
import { TestMap, NewCarousel, Carousel } from "../";
import "../style/index.css";

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [clickedEvents, setClickedEvents] = useState([]);
  const searchState = useSelector((state) => state.search);
  const events = useSelector((state) => state.search.events);
  const savedEventIds = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const totalEvents = useSelector((state) => state.search.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);

  useEffect(() => {
    dispatch(
      getSearchResults({
        query: searchState.query,
        postalCode: searchState.postalCode,
        dateRange: searchState.dateRange,
        page: page,
      })
    );
  }, [
    dispatch,
    searchState.query,
    searchState.postalCode,
    searchState.dateRange,
    page,
  ]);
  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter }));
    }
  }, [dispatch, filter]);

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

  const handleSelectDateRange = (dateRange) => {
    dispatch(setDateRange(dateRange));
  };

  return (
    <>
      <h1>Search Results</h1>
      <Container
        className="resultsContainer"
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   alignItems: "flex-start",
        // }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <Container
            style={{ position: "absolute", zIndex: 9999, width: "30%" }}
          >
            <DatePicker onSelectDateRange={handleSelectDateRange} />
          </Container>
          <Container
            className="filter"
            style={{
              marginTop: "4rem",
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
        </div>
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
                        backgroundColor: "slateGrey",
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
                          color: "white",
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
