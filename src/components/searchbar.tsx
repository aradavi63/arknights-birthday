import '../styles/app.css'
import operatorData from '../operators.json'
import FullCalendar from '@fullcalendar/react'
import Fuse from 'fuse.js'
import { useRef, useState } from 'react'

interface Operator {
    id: string;
    name: string;
    dob: string;
    image: string; 
}

export default function Searchbar({
    unknownDob,
    setSelectedDate,
}: {
    unknownDob: { name: string; image: string }[],
    calendarRef: React.RefObject<FullCalendar | null>,
    setSelectedDate: (date: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    // Autocomplete suggestions
    const [suggestions, setSuggestions] = useState<{ name: string; image: string }[]>([]);
    const fuseOptions = {keys: ['name']};
    const fuse = new Fuse(
        Object.values(operatorData),
        fuseOptions
    );

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (!value) {
            setSuggestions([]);
            return;
        }
        const results = fuse.search(value).map(r => r.item);
        setSuggestions(results.slice(0, 8)); // show top 8
    }

    function handleSuggestionClick(name: string) {
        if (inputRef.current) {
            inputRef.current.value = name;
            setSuggestions([]);
        }
    }

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
            setSelectedDate(dateStr); 
            return;
        }
        const dateMatch = value.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
        if (dateMatch) {
            const dateStr = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
            setSelectedDate(dateStr); 
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
                    <div className="flex flex-col items-center justify-center mx-auto relative">
                        <input
                            ref={inputRef}
                            type='search'
                            className='border-2 rounded-lg m-2 p-2'
                            placeholder='Amiya or 2025/12/23'
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-10 max-h-60 overflow-y-auto">
                                {suggestions.map(s => (
                                    <li
                                        key={s.name}
                                        className="p-2 hover:bg-secondary cursor-pointer flex items-center"
                                        onClick={() => handleSuggestionClick(s.name)}
                                    >
                                        <img src={s.image} alt={s.name} className="w-6 h-6 mr-2 rounded-full" />
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button type='submit' className='btn flex items-center gap-2 rounded-lg p-2 bg-secondary hover:bg-secondary-dark text-lg text-textWhite font-montserrat'>
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