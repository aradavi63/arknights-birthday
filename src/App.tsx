//import { useState } from 'react'
import Calendar from './components/calendar'
import Header from './components/header'
//import Sidebar from './components/sidebar'
import './styles/app.css'

export default function App() {
  return (
    <>
    <Header />
    <div className='grid grid-flow-col grid-rows-1 gap-3'>
      <div className='row-span-1'>
        <Calendar />
      </div>
    </div>
    
    </>
  )
}
