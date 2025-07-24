import { useMemo, useEffect } from 'react';

import type { EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react'
import interaction from '@fullcalendar/interaction';
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
  const dtstart = '1970-' + date;

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
  // Check if current view is multiMonthYear
  const isMultiMonth = arg.view.type === "multiMonthYear";
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
        className={isMultiMonth ? "w-5 h-5 sm:w-7 sm:h-7" : "w-8 h-8 sm:w-12 sm:h-12"}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default function Calendar({
  setUnknownDob,
  calendarRef,
  selectedDate,
  setSelectedDate
}: {
  setUnknownDob: React.Dispatch<React.SetStateAction<{ name: string; image: string }[]>>,
  calendarRef: React.RefObject<FullCalendar | null>,
  selectedDate?: string | null,
  setSelectedDate?: (date: string) => void
}) {
  const { events: bdayEvents, unknownDob } = useMemo(() => addBirthdays(), []);
  useEffect(() => {
    setUnknownDob(unknownDob);
  }, [unknownDob, setUnknownDob]);

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate);
    }
  }, [selectedDate, calendarRef]);

  // Forces calendar to correct size on initial render
  useEffect(() => {
  if (calendarRef.current) {
    setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, 0);
  }
}, [calendarRef]);

  useEffect(() => {
    function handleResize() {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }
    window.addEventListener('resize', handleResize);
    // Initial call
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [calendarRef]);

  let windowMobile = 1.2 
  if (window.innerWidth < 640) {
    windowMobile = 0.6
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-8 px-2 sm:px-0"> {/* Added px-2 for mobile padding */}
      <FullCalendar
        ref={calendarRef} 
        plugins={[ interaction, dayGrid, multiMonth, rrulePlugin ]}
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
        fixedWeekCount={true}
        showNonCurrentDates={false}
        dayMaxEventRows={false}
        height="auto"
        contentHeight="auto"
        aspectRatio={windowMobile} 
        events={bdayEvents}
        eventBackgroundColor={'transparent'}
        eventBorderColor={'transparent'}
        eventContent={renderAvatar}
        dateClick={arg => {
          if (setSelectedDate) {
            const localDate = arg.date;
            const yyyy = localDate.getFullYear();
            const mm = String(localDate.getMonth() + 1).padStart(2, '0');
            const dd = String(localDate.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            console.log('Selected date:', formattedDate); 
            setSelectedDate(formattedDate); 
          }
        }}
        dayCellClassNames={arg => {
          if (selectedDate) {
            const yyyy = arg.date.getFullYear();
            const mm = String(arg.date.getMonth() + 1).padStart(2, '0');
            const dd = String(arg.date.getDate()).padStart(2, '0');
            const localDateStr = `${yyyy}-${mm}-${dd}`;
            if (localDateStr === selectedDate) {
              return ['highlighted-date'];
            }
          }
          return [];
        }}
      />
    </div>
  )
}