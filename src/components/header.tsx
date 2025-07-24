import '../styles/app.css'
import riLogo from '/ri-logo.png'

export default function Header() {
    return (
        <header className="bg-primary w-full">
            <div className="flex w-full h-24 px-4 sm:px-6">
                <div className="flex items-center justify-start">
                    <h1 className="text-3xl sm:text-5xl text-textWhite font-oswald font-semibold">
                        Rhodes Island Birthdays
                    </h1>
                </div>
                <div className="flex items-center justify-end ml-auto">
                    <img
                        src={riLogo}
                        alt="Rhodes Island Logo"
                        className="h-16 w-16 sm:h-24 sm:w-24"
                    />
                </div>
            </div>
        </header>
    )
}