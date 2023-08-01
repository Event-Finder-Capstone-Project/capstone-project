import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "....."
import BackButton from "./BackButton";
import Toastify from 'toastify-js'


const SingleEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getSingleEvent(id));
    };
  }, [dispatch, id]);

  const event = useSelector((state) => state.singleEvent.singleEvent);
  const venue = useSelector((state) => state.singleEvent.singleEvent.venue);


  return (
    <div className="event-details">
      {event ? (
        <>
          <div className="single-event-container">
            <h2>{event.title}</h2>
            <h3>{event.datetime_utc}</h3>
            <img src={event.image} className="event-img" alt="" />
            <div>
              <h3>{venue.name_v2}</h3> 
              <p>{venue.address}</p>
              <p>{venue.city} {venue.state}</p>
            </div>
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
