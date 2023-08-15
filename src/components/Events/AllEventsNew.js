import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { getAllEvents, selectEvents } from "../../store/allEventsSlice";
import { handleEvents, handleEventAsync } from "../../store/eventsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
  const [rerender, setRerender] = useState(false);
  const storedCity = localStorage.getItem("userCity");
  const storedState = localStorage.getItem("userState");
  const savedEventIds = useSelector((state) => state.events);

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

  // const handleFilter = () => {
  //   setPage(1);
  //   dispatch(getAllEvents({ type: filter, page: 1 }));
  // };

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
      <Container>
        <NewCarousel />
      </Container>
      <Container
        class="text-center"
        className="all-events-container"
        style={{
          marginTop: "3rem",
          minWidth: "100%",
        }}>
        <div className="filter-container">
          <Container
            style={{
              marginTop: ".5rem",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}>
            <h5
              style={{
                paddingTop: ".3rem",
                marginRight: "1rem",
              }}>
              Event Type
            </h5>
            <select
              style={{ height: "35px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
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
              <Container>
                {events?.length
                  ? events.map((event) => (
                      <Row
                        xs={1}
                        md={2}
                        style={{
                          marginBottom: "2rem",
                          minWidth: "100%",
                          backgroundColor: "slategray",
                        }}>
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
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          }}>
                          <Button
                            variant="outline"
                            style={{
                              border: "none",
                              fontSize: "32px",
                            }}
                            onClick={() => handleAddEvents(event.id)}>
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
                                }}
                                id="event-name">
                                {event.title}
                              </h4>
                            </Nav.Link>
                          </LinkContainer>
                        </Col>
                      </Row>
                    ))
                  : // <p>{!events?.length ? "No events found!" : ""}</p>
                    null}
              </Container>
            </Col>
          </Row>
        </Container>

        <Container
          className="d-flex justify-content-center"
          style={{ alignContent: "center", marginTop: "2rem" }}>
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
