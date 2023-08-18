import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "../style/BigCalendar.css";

// Localizing date functionality
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

// Setting up the dateFns localizer for calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BigCalendar = ({ savedEvents }) => {

    const [allEvents, setAllEvents] = useState([]);
  
    //initialize events from savedEvents prop
    useEffect(() => {
      const initialEvents = savedEvents
        .filter(event => event !== undefined && event.status !== 400)
        .map(event => {
      const startDate = new Date(event.datetime_utc);
      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));

      return {
        id: event.id,
        title: event.title,
        start: startDate,
        end: endDate,
      };
    });

  setAllEvents(initialEvents);
}, [savedEvents]);
   // Effect to load events from local storage on mount
    useEffect(() => {
      const storedEvents = JSON.parse(localStorage.getItem("calendar"));
      if (storedEvents) {
        setAllEvents(storedEvents);
      }
    }, []);
  // Effect to save events to local storage whenever they change
    useEffect(() => {
      localStorage.setItem("calendar", JSON.stringify(allEvents));
    }, [allEvents]);
  
 // Render the calendar component with the events
  return (
    <div className="App">
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        className="stickyCalendar"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default BigCalendar;
