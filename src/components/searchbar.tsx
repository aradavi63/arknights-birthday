import '../styles/app.css'
import operatorData from '../operators.json'
import FullCalendar from '@fullcalendar/react'
import { useRef } from 'react'

interface Operator {
    id: string;
    name: string;
    dob: string;
    image: string; 
}

export default function Searchbar({
    unknownDob,
    calendarRef
}: {
    unknownDob: { name: string; image: string }[],
    calendarRef: React.RefObject<FullCalendar | null>
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    function Search(e: React.FormEvent) {
        e.preventDefault();
        const value = inputRef.current?.value.trim();
        if (!value) return;

        const unknown = unknownDob.find(op => op.name.toLowerCase() === value.toLowerCase());
        if (unknown) {
            const unknownBox = document.querySelector('h1:text("Unknown Birthdays")')?.parentElement;
            if (unknownBox) {
                unknownBox.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            return;
        }
        const op = (Object.values(operatorData) as Operator[]).find(
            (o: Operator) => o.name.toLowerCase() === value.toLowerCase()
        );
        if (op && op.dob && !unknownDob.some(u => u.name === op.name)) {
            const dateStr = '2025-' + op.dob;
            calendarRef.current?.getApi().gotoDate(dateStr);
            return;
        }
        const dateMatch = value.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
        if (dateMatch) {
            const dateStr = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
            calendarRef.current?.getApi().gotoDate(dateStr);
            return;
        }
        alert('No operator or date found. Please check your input.');
    }

    return (
        <div className='grid grid-rows-1 items-center justify-center mx-auto mt-2'>
            <div className='row-span-1 mt-2 mb-2'>
                <h2 className='text-2xl text-textBlack font-montserrat font-semibold'>Search for an operator or date (YYYY/MM/DD)</h2>
            </div>
            <div>
                <form onSubmit={Search}>
                    <div className="flex items-center justify-center mx-auto">
                        <input ref={inputRef} type='search' className='border-2 rounded-lg m-2 p-2' placeholder='Amiya or 2025/12/23'/>
                        <button type='submit' className='btn flex items-center gap-2 rounded-lg p-2 bg-secondary text-lg text-textWhite font-montserrat'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" fill="#dfe2df">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5
                                6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5
                                4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5
                                5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                            <span>Search</span>
                        </button> 
                    </div>
                </form>
            </div>
        </div>
    )
}