import { Nav, Carousel } from "react-bootstrap";
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
    <Carousel>
      {sortedEvents.map((event, index) => (
        <Carousel.Item key={index}>
          {/* <LinkContainer to={`/events/${event.id}`}>
            <Nav.Link> */}
          <img src={event.performers[0].image} alt={`${index + 1}`} />
          <Carousel.Caption style={{ color: "white" }}>
            <h4 className="legend">{event.title}</h4>
          </Carousel.Caption>
          {/* </Nav.Link>
          </LinkContainer> */}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default NewCarousel;
