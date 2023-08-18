import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import React, { useEffect, useState } from "react";
import { useSelector} from "react-redux";
import { selectEvents } from "../../store/allEventsSlice";

const Carousel = () => {
  // Retrieve events data from the Redux store
  const events = useSelector(selectEvents);

  // Sort and select the top 4 events based on venue score
  const sortedEvents = [...events]
    .sort((a, b) => b.venue.score - a.venue.score)
    .slice(0, 4);

  // State to keep track of the currently displayed slide index
  const [startSlide, setStartSlide] = useState(0);

  useEffect(() => {
    // Set a timeout to update the startSlide and simulate autoplay
    const autoplayTimeout = setTimeout(() => {
      // Update startSlide by incrementing it and looping back to the beginning if necessary
      setStartSlide((startSlide + 1) % sortedEvents.length);
    }, 3000);

    // Clean up by clearing the timeout when the component unmounts or startSlide/length changes
    return () => {
      clearTimeout(autoplayTimeout);
    };
  }, [startSlide, sortedEvents.length]);


  return (
    <div style={{ maxWidth: "100%", backgroundColor: "black" }}>
      <ResponsiveCarousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        interval={3000}
        selectedItem={startSlide}
        showThumbs={false}
      >
        {sortedEvents.map((event, index) => (
          <div key={index}>
            <a href={`/events/${event.id}`}>
              <img
                src={event.performers[0].image}
                alt={`${index + 1}`}
                style={{ maxWidth: "50%", maxHeight: "auto" }}
              />
              <p className="legend">{event.title}</p>
            </a>
          </div>
        ))}
      </ResponsiveCarousel>
    </div>
  );
};

export default Carousel;
