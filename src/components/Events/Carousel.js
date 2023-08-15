import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import React, { useEffect, useState } from "react";
import { useSelector} from "react-redux";
import { selectEvents } from "../../store/allEventsSlice";

const Carousel = () => {
  const events = useSelector(selectEvents);
  const sortedEvents = [...events]
  // smart sorting for recommendations!
    .sort((a, b) => b.venue.score - a.venue.score)
    .slice(0, 4);

  const [startSlide, setStartSlide] = useState(0);

  useEffect(() => {
    const autoplayTimeout = setTimeout(() => {
      setStartSlide((startSlide + 1) % sortedEvents.length);
    }, 3000);

    return () => {
      clearTimeout(autoplayTimeout);
    };
  }, [startSlide, sortedEvents.length]);

  return (
    <div style={{ maxWidth: "100%", backgroundColor: "black" }}>
      {/* I was gonna leave some feedback about this -- but I don't think this component is actually being used anymore, is it? If not, let's delete this file */}
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
