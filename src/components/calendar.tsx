import { useMemo } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGrid from '@fullcalendar/daygrid'
import multiMonth from '@fullcalendar/multimonth'
//import interactionPlugin from "@fullcalendar/interaction"

import '../styles/app.css'
import '../styles/calendar.css'
import operatorData from '../operators.json'

const unknownDob: string[] = [];

function convertDateToTime(date: string): string{
  const freq = 'FREQ=YEARLY;';
  let month = '';
  const day = 'BYDAY=' + date.slice(-2);
  if (date.startsWith('Jan')) {
    month = 'BYMONTH=1;';
  }
  else if (date.startsWith('Feb')) {
    month = 'BYMONTH=2;';
  }
  else if (date.startsWith('Mar')) {
    month = 'BYMONTH=3;';
  }
  else if (date.startsWith('Apr')) {
    month = 'BYMONTH=4;';
  }
  else if (date.startsWith('May')) {
    month = 'BYMONTH=5';
  }
  else if (date.startsWith('Jun')) {
    month = 'BYMONTH=6;';
  }
  else if (date.startsWith('Jul')) {
    month = 'BYMONTH=7;';
  }
  else if (date.startsWith('Aug')) {
    month = 'BYMONTH=8;';
  }
  else if (date.startsWith('Sep')) {
    month = 'BYMONTH=9;';
  }
  else if (date.startsWith('Oct')) {
    month = 'BYMONTH=10;';
  }
  else if (date.startsWith('Nov')) {
    month = 'BYMONTH=11;';
  }
  else if (date.startsWith('Dec')) {
    month = 'BYMONTH=12;';
  }
  const rule = freq+month+day;
  return rule;
}

function addBirthdays() {
  const events: { id: string, title: string; rrule: string, allDay: boolean }[] = [];
  for (const operator of Object.values(operatorData)) {
    if (isNaN(Number(operator.dob[operator.dob.length - 1]))) { // If last element of DOB not a number, should be unknown
      unknownDob.push(operator.id)
    }
    else {
      const birthday = convertDateToTime(operator.dob)
      events.push(
        {
          id : operator.name,
          title : operator.name,
          rrule : birthday,
          allDay : true
        }
      )
    }
  }
  return events;
}

export default function Calendar() {
  const bdayEvents = useMemo(() => addBirthdays(), []);
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
      initialEvents={bdayEvents}
    />
    </div>
  )
}