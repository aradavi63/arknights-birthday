import { useState } from 'react'
import Calendar from './components/calendar'
import Header from './components/header'
import UnknownBdayBox from './components/unknownBday'
import './styles/app.css'

export default function App() {
  const [unknownDob, setUnknownDob] = useState<{ name: string; image: string }[]>([]);
  return (
    <>
    <Header />
    <div className='grid grid-flow-col grid-rows-1 gap-3'>
      <div className='row-span-1'>
        <Calendar setUnknownDob={setUnknownDob} />
        <UnknownBdayBox unknownDob={unknownDob} />
      </div>
    </div>
    </>
  )
}
