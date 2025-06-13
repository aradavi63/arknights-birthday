import FullCalendar from '@fullcalendar/react'
import dayGrid from '@fullcalendar/daygrid'
import multiMonth from '@fullcalendar/multimonth'
//import interactionPlugin from "@fullcalendar/interaction"
import '../index.css'

export default function Calendar() {
    return (
      <FullCalendar
        plugins={[ dayGrid, multiMonth ]}
        initialView="dayGridMonth"
        headerToolbar= {{
          left: 'prev,next today',
          center: 'title',
          right: 'multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay'
        }}
      />
    )
}