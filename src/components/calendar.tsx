import FullCalendar from '@fullcalendar/react'
import dayGrid from '@fullcalendar/daygrid'
//import interactionPlugin from "@fullcalendar/interaction"
import '../index.css'

export default function Calendar() {
    return (
      <FullCalendar
        plugins={[ dayGrid ]}
        initialView="dayGridMonth"
        headerToolbar= {{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridYear,dayGridMonth,dayGridWeek,dayGridDay'
        }}
      />
    )
}