import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/singleEventSlice";
import BackButton from "../BackButton";
import Toastify from "toastify-js";

const SingleEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
      dispatch(getSingleEvent(id));
  }, [dispatch, id]);

  const event = useSelector((state) => state.singleEvent.singleEvent);
  console.log('this is the event:', event)
  //const venue = event.venue;

  return (
    <div className="event-details">
      {event ? (
        <>
          <div className="single-event-container">
            <h2>{event.title}</h2>
            <h3>{event.datetime_utc}</h3>
            <img src={event.performers[0].image} className="event-img" alt="" />
            {event.venue ? (
              <div>
              <h3>{event.venue.name_v2}</h3>
              <p>{event.venue.address}</p>
              <p>
                {event.venue.city}, {event.venue.state}
              </p>
            </div>  ) :( null
             )}

            <BackButton />
          </div>
        </>
      ) : (
        <p className="loading-text">Loading event...</p>
      )}
    </div>
  );
};

export default SingleEvent;
