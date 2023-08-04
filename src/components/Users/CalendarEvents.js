import * as React from 'react'
import '../style/Calendar.css'
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule'
const CalendarEvents = () => {
    const storedEvents = JSON.parse(localStorage.getItem('calendar')) || [];
    const [allEvents, setAllEvents] = React.useState(storedEvents);


    const handleActionBegin = (args) => {
      const updatedEvents = {...allEvents};
      if (args.requestType === 'eventCreate') {
        const newEvent = args.data[0];
        updatedEvents[newEvent.Id] = newEvent;
        console.log(newEvent);
      } else if (args.requestType === 'eventRemove') {
        delete updatedEvents[args.data[0].Id];
      } else if (args.requestType === 'eventChange') {
        const updatedEvent = args.data[0];
        updatedEvents[updatedEvent.Id] = updatedEvent; 
      }
      console.log('Updated Events:', updatedEvents);
      setAllEvents(updatedEvents);
      localStorage.setItem('calendar', JSON.stringify
      (updatedEvents));
      console.log(allEvents)
    };

  return (
    <div>
      <ScheduleComponent width='70%' height='450px' currentView='Month'
       actionBegin={handleActionBegin}
       eventSettings={{ dataSource: Object.values(allEvents) }}>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
      </ScheduleComponent>
    </div>
  )
}
export default CalendarEvents;