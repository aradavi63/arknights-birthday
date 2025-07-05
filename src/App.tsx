import { useRef, useState } from 'react'
import Calendar from './components/calendar'
import Header from './components/header'
import UnknownBdayBox from './components/unknownBday'
import Searchbar from './components/searchbar'
import './styles/app.css'
import type FullCalendar from '@fullcalendar/react'

export default function App() {
  const [unknownDob, setUnknownDob] = useState<{ name: string; image: string }[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  return (
    <>
    <Header />
    <div className='grid grid-flow-col grid-rows-1 gap-3'>
      <div className='row-span-1'>
        <Searchbar unknownDob={unknownDob} calendarRef={calendarRef} />
        <Calendar setUnknownDob={setUnknownDob} calendarRef={calendarRef} />
        <UnknownBdayBox unknownDob={unknownDob} />
      </div>
    </div>
    </>
  )
}
