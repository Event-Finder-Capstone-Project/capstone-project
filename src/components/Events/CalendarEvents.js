import * as React from 'react'
import '../style/Calendar.css'
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule'

const CalendarEvents = () => {


  return (
    <div>
      <ScheduleComponent width='100%' height='650px' currentView='Month'>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
      </ScheduleComponent>
    </div>
  )
}


export default CalendarEvents;