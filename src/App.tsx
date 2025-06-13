//import { useState } from 'react'
import Calendar from './components/calendar'
import Header from './components/header'
import Sidebar from './components/sidebar'
import './index.css'

export default function App() {
  return (
    <>
    <Header />
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Sidebar />
      </div>
      <div col-span-full>
        <Calendar />
      </div>
    </div>
    
    </>
  )
}
