import React, { useEffect, useState } from 'react';
import '../style/Calendar.css';
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from '@syncfusion/ej2-react-schedule';

const CalendarEvents = ({ savedEvents }) => {
  const objectOfSavedEvents = savedEvents
    .map((event) => ({
      Id: event.id,
      Subject: event.title,
      StartTime: new Date(event.datetime_utc),
      EndTime: new Date(event.datetime_utc),
      IsAllDay: true,
    }))
    .reduce((acc, obj) => {
      acc[obj.Id] = obj;
      return acc;
    }, {});

  // Save objectOfSavedEvents to local storage
  localStorage.setItem('calendar', JSON.stringify(objectOfSavedEvents));

  // Retrieve stored events from local storage
  const storedEvents = JSON.parse(localStorage.getItem('calendar')) || {};

  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    // Load stored events from local storage into the state
    setAllEvents(storedEvents);
  }, [allEvents]);

  const handleActionBegin = (args) => {
    const updatedEvents = { ...allEvents };
    if (args.requestType === 'eventCreate') {
      const newEvent = args.data[0];
      updatedEvents[newEvent.Id] = newEvent;
    } else if (args.requestType === 'eventRemove') {
      delete updatedEvents[args.data[0].Id];
    } else if (args.requestType === 'eventChange') {
      const updatedEvent = args.data[0];
      updatedEvents[updatedEvent.Id] = updatedEvent;
    }
    setAllEvents(updatedEvents);

    // Update local storage with the modified events
    localStorage.setItem('calendar', JSON.stringify(updatedEvents));
  };

  return (
    <div>
      <ScheduleComponent
        width='70%'
        height='450px'
        currentView='Month'
        actionBegin={handleActionBegin}
        eventSettings={{ dataSource: Object.values(allEvents) }}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
      </ScheduleComponent>
    </div>
  );
};

export default CalendarEvents;

