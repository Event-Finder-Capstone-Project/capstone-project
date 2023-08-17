import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style/BigCalendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BigCalendar = ({ savedEvents }) => {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const initialEvents = savedEvents
      .filter((event) => event !== undefined && event.status !== 400)
      .map((event) => ({
        id: event.id, // assuming each savedEvent has a unique id
        title: event.title,
        start: new Date(event.datetime_utc),
        end: new Date(event.datetime_utc),
        allDay: true,
      }));

    setAllEvents(initialEvents);
  }, [savedEvents]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendar"));
    if (storedEvents) {
      setAllEvents(storedEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar", JSON.stringify(allEvents));
  }, [allEvents]);

  return (
    <div className="App">
      {/* <h3>Event Calendar</h3> */}
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
