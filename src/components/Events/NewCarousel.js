import { Nav, Carousel, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEvents } from "../../store/allEventsSlice";

const NewCarousel = () => {
  const events = useSelector(selectEvents);
  const sortedEvents = [...events]
    .sort((a, b) => b.venue.score - a.venue.score)
    .slice(0, 4);

  return (
    <Container>
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
                  style={{ paddingLeft: "11%", color: "white", width: "59%" }}
                >
                  <h4 className="legend">{event.title}</h4>
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
