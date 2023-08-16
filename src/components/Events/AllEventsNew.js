import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import {
  Nav,
  Row,
  Col,
  Form,
  FloatingLabel,
  Container,
  Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { TestMap, NewCarousel, Carousel } from "../";
import { eventEmitter } from "../App";
import PrevNext from "./PrevNext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const AllEventsNew = () => { 
  const [eventsData, setEventsData] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [rerender, setRerender] = useState(false);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");
  const savedEventIds = useSelector((state) => state.events);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");
  const pageParam = queryParams.get("page");
  const [filter, setFilter] = useState(filterParam || ""); 
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const navigate = useNavigate();
  const [scrollToEvents, setScrollToEvents] = useState(false);

  const dispatch = useDispatch();
  const totalEvents = useSelector((state) => state.allEvents.totalEvents);
  const totalPages = Math.ceil(totalEvents / 8);

  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("scrollPosition", window.scrollY);
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  useEffect(() => {
    if (filter === "") {
      dispatch(getAllEvents({ type: filter, page: 1 }));
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
 
  const events = useSelector(selectEvents);
  const latitude = useSelector((state) => state.location.latitude);
  const longitude = useSelector((state) => state.location.longitude);
  const scrollPosition = localStorage.getItem("scrollPosition"); 

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
        window.scrollTo(0, scrollPosition);}
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
        window.scrollTo(0, scrollPosition);}
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

  useEffect(() => {
    if (scrollToEvents) {
      const eventsContainer = document.getElementById("all-events-container");
      eventsContainer.scrollIntoView({ behavior: "smooth" });
      setScrollToEvents(false); 
    }
  }, [scrollToEvents]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); 
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    navigate(`/?filter=${filter}&page=${page}`);
    setScrollToEvents(true);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    navigate(`/?filter=${filter}&page=${page}`);
    setScrollToEvents(true);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    navigate(`/?filter=${filter}&page=${pageNumber}`);
    setScrollToEvents(true);
  };

  return (
    <>
      <h1> Popular in your area </h1>
      <Container>
        <NewCarousel />
      </Container>
      <Container
        class="text-center"
        className="all-events-container"
        id="all-events-container"
        style={{
          marginTop: "3rem",
          minWidth: "100%",
        }}
      >
        <Container style={{ width: "15%" }}>
          <FloatingLabel label="Event Type" className="filter-container">
            <Form.Select
              style={{}}
              value={filter}
              onChange={(e) => {
                handleFilterChange(e.target.value);
                navigate(`/?filter=${e.target.value}&page=1`);
              }}
            >
              <option value="">None</option>
              {eventsData.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
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
                     <LinkContainer
  to={{
    pathname: `/events/${event.id}`,
    search: `?filter=${filter}&page=${page}`
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
      </Container>
    </>
  );
};
export default AllEventsNew;
