import { Nav, Carousel, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEvents } from "../../store/allEventsSlice";

const NewCarousel = () => {
  const events = useSelector(selectEvents);
  const sortedEvents = [...(events || [])]
    .sort((a, b) => b.venue.score - a.venue.score)
    .slice(0, 4);

  return (
    <Container style={{ width: "100%", height: "40%" }}>
      <Carousel data-bs-theme="dark">
        {sortedEvents.map((event, index) => (
          <Carousel.Item key={index}>
            <LinkContainer
              className="d-flex justify-content-center"
              to={`/events/${event.id}`}
            >
              <Nav.Link>
                <img
                  style={{ width: "40%", height: "40%" }}
                  src={event.performers[0].image}
                  alt={`${index + 1}`}
                />
                <Carousel.Caption
                  style={{ paddingLeft: "15%", color: "white", width: "55%" }}
                >
                  <h4 style={{ maxHeight: "50%" }} className="legend">
                    {event.title}
                  </h4>
                </Carousel.Caption>
              </Nav.Link>
            </LinkContainer>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default NewCarousel;
