import '../styles/app.css'
import operatorData from '../operators.json'
import Alert from './alert'
import FullCalendar from '@fullcalendar/react'
import Fuse from 'fuse.js'
import { useRef, useState, useEffect } from 'react'

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
    const containerRef = useRef<HTMLDivElement>(null); 
    // Autocomplete suggestions
    const [suggestions, setSuggestions] = useState<{ name: string; image: string }[]>([]);
    const fuseOptions = {threshold: 0.5, distance: 5, keys: ['name']};
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

    const [showAlert, setShowAlert] = useState(false);
    function Search(e: React.FormEvent) {
        e.preventDefault();
        setSuggestions([]);
        const value = inputRef.current?.value.trim();
        if (!value) return;

        const unknown = unknownDob.find(op => op.name.toLowerCase() === value.toLowerCase());
        if (unknown) {
            const unknownBox = document.getElementById('unknownBox')?.parentElement;
            if (unknownBox) {
                window.scrollTo({ 
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth' 
                });
            }
            return;
        }
        const op = (Object.values(operatorData) as Operator[]).find(
            (o: Operator) => o.name.toLowerCase() === value.toLowerCase()
        );
        if (op && op.dob && !unknownDob.some(u => u.name === op.name)) {
            const dateStr = '2025-' + op.dob;
            setSelectedDate(dateStr); 

            setTimeout(() => {
                const cell = document.querySelector(`.fc-day[data-date="${dateStr}"]`);
                if (cell) {
                    (cell as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100); 
            return;
        }
        const dateMatch = value.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
        if (dateMatch) {
        const [year, month, day] = dateMatch;
        const dateStr = `${year}-${month}-${day}`;

        const dateObj = new Date(`${year}-${month}-${day}`);
        const isValidDate =
            dateObj instanceof Date &&
            !isNaN(dateObj.getTime()) &&
            dateObj.getFullYear() === parseInt(year) &&
            dateObj.getMonth() + 1 === parseInt(month) &&
            dateObj.getDate() === parseInt(day);

        if (isValidDate) {
            setSelectedDate(dateStr);

            setTimeout(() => {
            const cell = document.querySelector(`.fc-day[data-date="${dateStr}"]`);
            if (cell) {
                (cell as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
            }
            }, 100);
            return;
            }
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setSuggestions([]);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='grid grid-rows-1 items-center justify-center mx-auto mt-2'>
            <div className='row-span-1 mt-2 mb-2 text-center'>
                <h2 className='text-xs md:text-base text-textBlack font-montserrat'>Find the birthdays of your favorite characters from Arknights!</h2>
                <h2 className='text-sm md:text-2xl text-textBlack font-montserrat font-semibold'>Search for an operator or date (YYYY/MM/DD)</h2>
            </div>
            <div>
                <form onSubmit={Search}>
                    <div
                        ref={containerRef}
                        className="flex flex-col items-center justify-center mx-auto relative"
                    >
                        {showAlert && <Alert />}
                        <input
                            ref={inputRef}
                            type='search'
                            className='border-2 rounded-lg m-2 p-1 text-sm w-full max-w-xs sm:p-2 sm:text-base sm:max-w-md focus:outline-none'
                            placeholder='Amiya or 2025/12/23'
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-background border border-primary rounded-lg shadow z-10 max-h-60 overflow-y-auto">
                                {suggestions.map(s => (
                                    <li
                                        key={s.name}
                                        className="w-full max-w-xs sm:p-2 sm:text-base sm:max-w-xl hover:bg-secondary text-textBlack hover:text-textWhite cursor-pointer flex items-center"
                                        onClick={() => handleSuggestionClick(s.name)}
                                    >
                                        <img src={s.image} alt={s.name} className="w-6 h-6 mr-2" />
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            type='submit'
                            className='btn flex items-center gap-2 rounded-lg p-1 text-base sm:p-2 sm:text-lg bg-secondary hover:bg-secondary-dark text-textWhite font-montserrat'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 24 24" fill="#dfe2df">
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