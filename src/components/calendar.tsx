import { useMemo, useEffect } from 'react';

import type { EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react'
import dayGrid from '@fullcalendar/daygrid'
import multiMonth from '@fullcalendar/multimonth'
import rrulePlugin from '@fullcalendar/rrule'

import '../styles/app.css'
import '../styles/calendar.css'
import operatorData from '../operators.json'

type eventInfo = {
  id: string, 
  title: string; 
  rrule: {freq: 'yearly', dtstart: string}, 
  allDay: boolean, 
  extendedProps : {image: string}
}

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
  const events: eventInfo[] = [];
  const unknownDob: { name: string; image: string }[] = [];
  for (const operator of Object.values(operatorData)) {
    if (isNaN(Number(operator.dob[operator.dob.length - 1]))) {
      unknownDob.push({ name: operator.name, image: operator.image });
    } else {
      const birthday = convertDateToTime(operator.dob)
      events.push(
        {
          id : operator.name,
          title : operator.name,
          rrule : birthday,
          allDay : true,
          extendedProps : {image: operator.image}
        }
      )
    }
  }
  return { events, unknownDob };
}

function renderAvatar(arg: EventContentArg) {
  const imageUrl = arg.event.extendedProps.image;
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    }}>
      <img 
        src={imageUrl} 
        alt={arg.event.title}
        title={arg.event.title}
        style={{
          width: '48px',
          height: '48px',
          cursor: 'pointer'
        }}
      />
    </div>
  );
}

export default function Calendar({ setUnknownDob }: { setUnknownDob: React.Dispatch<React.SetStateAction<{ name: string; image: string }[]>> }) {
  const { events: bdayEvents, unknownDob } = useMemo(() => addBirthdays(), []);
  useEffect(() => {
    setUnknownDob(unknownDob);
  }, [unknownDob, setUnknownDob]);
  return (
    <div className='max-w-7xl mx-auto mt-8'>
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
      eventBackgroundColor={'transparent'}
      eventBorderColor={'transparent'}
      eventContent={renderAvatar}
    />
    </div>
  )
}