import '../styles/app.css'

export default function UnknownBdayBox({ unknownDob }: { unknownDob: { name: string; image: string }[] }) {
    return (
        <div className="flex flex-col items-center justify-center m-8" id="unknownBox">
            <h1 className="text-4xl text-textBlack font-oswald font-semibold text-center">
                Unknown Birthdays
            </h1>
            <div className="border-2 border-b-primary w-full mt-2"></div>
            <div className="flex flex-wrap justify-center">
                {unknownDob.map(({ name, image }) => (
                    <img
                        key={name}
                        src={image}
                        alt={name}
                        title={name}
                        className="w-8 h-8 sm:w-16 sm:h-16 m-2 object-cover"
                    />
                ))}
            </div>
        </div>
    )
}