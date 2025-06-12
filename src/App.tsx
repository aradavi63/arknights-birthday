//import { useState } from 'react'
import Calendar from './components/calendar'
import Header from './components/header'
import OpList from './components/opList'
import './index.css'

export default function App() {
  return (
    <>
    <Header />
    <div className="columns-2 gap-2">
      <Calendar />
      <OpList />
    </div>
    
    </>
  )
}
