import '../styles/app.css'

export default function Alert() {
    return (    
    <div className="bg-error border border-accent text-white text-sm sm:text-lg font-montserrat px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span>Invalid input.</span>
    </div>
)}