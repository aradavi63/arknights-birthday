import { useMemo } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGrid from '@fullcalendar/daygrid'
import multiMonth from '@fullcalendar/multimonth'
import rrulePlugin from '@fullcalendar/rrule'
//import interactionPlugin from "@fullcalendar/interaction"

import '../styles/app.css'
import '../styles/calendar.css'
import operatorData from '../operators.json'

const unknownDob: string[] = [];

function convertDateToTime(date: string): {freq: 'yearly', dtstart: string}  {
  let month = '';
  if (date.startsWith('Jan')) month = '01-';
  else if (date.startsWith('Feb')) month = '02-';
  else if (date.startsWith('Mar')) month = '03-';
  else if (date.startsWith('Apr')) month = '04-';
  else if (date.startsWith('May')) month = '05-';
  else if (date.startsWith('Jun')) month = '06-';
  else if (date.startsWith('Jul')) month = '07-';
  else if (date.startsWith('Aug')) month = '08-';
  else if (date.startsWith('Sep')) month = '09-';
  else if (date.startsWith('Oct')) month = '10-';
  else if (date.startsWith('Nov')) month = '11-';
  else if (date.startsWith('Dec')) month = '12-';

  const dayNum = date.slice(-2);
  let day = '';
  if (dayNum[0] === ' ') {
    day = '0' + dayNum[1];
  }
  else {
    day = dayNum;
  }
  const dtstart = '1970-' + month + day;

  return {
    freq: 'yearly',
    dtstart: dtstart
  };
}

function addBirthdays() {
  const events: { id: string, title: string; rrule: {freq: 'yearly', dtstart: string}, allDay: boolean }[] = [];
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
      plugins={[ dayGrid, multiMonth, rrulePlugin ]}
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
      validRange={{start:'1970-01-01'}}
      fixedWeekCount={false}
      showNonCurrentDates={false}
      height={750}
      events={bdayEvents}
    />
    </div>
  )
}