import '../index.css'

export default function Header() {
    return (
        <header className="bg-primary w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-content-left h-16">
                    <h1 className="text-xl text-textWhite font-oswald font-semibold">
                        Rhodes Island Birthdays
                    </h1>
                </div>
            </div>
        </header>
    )
}