import '../index.css'
import riLogo from '/ri-logo.png'

export default function Header() {
    return (
        <header className="bg-primary w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-24">
                    <div className="flex items-center justify-start">
                        <h1 className="text-5xl text-textWhite font-oswald font-semibold">
                            Rhodes Island Birthdays
                        </h1>
                    </div>
                    <div className="flex items-center justify-end ml-auto">
                        <img src={riLogo} alt="Rhodes Island Logo" className="h-24 w-24" />
                    </div>
                </div>
            </div>
        </header>
    )
}