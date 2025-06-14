//import { useRef } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGrid from '@fullcalendar/daygrid'
import multiMonth from '@fullcalendar/multimonth'
//import interactionPlugin from "@fullcalendar/interaction"
import '../styles/app.css'
import '../styles/calendar.css'

export default function Calendar() {
    return (
      <div className='max-w-7xl mx-auto'>
        <FullCalendar
        plugins={[ dayGrid, multiMonth ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay'
        }}
        buttonText={{
          today: 'Today',
          multiMonthYear: 'Year',
          month: 'Month',
          week: 'Week',
          day: 'Day'
        }}
        height={800}
      />
      </div>
    )
}