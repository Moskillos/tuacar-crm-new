import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CalendarComponent(rentArray: { rented: any[]; hold: any[]; init: any[] }) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [weekDays, setWeekDays] = useState<string[]>([])

    useEffect(() => {
        const days = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1);
        setDaysInMonth(days as []);
    }, [currentYear, currentMonth]);

    const monthNames = [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
    ];

    //const rented = ["1-3-2024", "2-3-2024"];
    //const hold = ["3-3-2024", "4-3-2024", "5-3-2024"];
    //const holdPayment = ["6-5-2024", "7-3-2024", "8-3-2024"];

    const navigateMonth = (direction: string, init: boolean) => {
        // Calculate new month and year based on direction
        let newMonth = currentMonth;
        let newYear = currentYear;

        if (!init) {
            if (direction === "prev") {
                newMonth = currentMonth - 1;
                if (newMonth < 0) {
                    newMonth = 11;
                    newYear -= 1;
                }
            } else {
                newMonth = currentMonth + 1;
                if (newMonth > 11) {
                    newMonth = 0;
                    newYear += 1;
                }
            }
        }

        // Update the state
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);

        // Create the date string in the format YYYY-MM-DD test
        const dateStr = `${newYear}-${String(newMonth + 1).padStart(2, '0')}-01`;

        // Convert string to date object
        const dateObj = new Date(dateStr);

        // Array of days of the week
        const daysOfWeek = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];

        // Get the starting day of the week
        const startDay = dateObj.getDay();

        // Generate the array containing the next 12 days of the week
        const next7Days = [];
        for (let i = 0; i < 7; i++) {
            next7Days.push(daysOfWeek[(startDay + i) % 7]);
        }

        // Update the week days state
        setWeekDays(next7Days);

        //console.log("currentM: ", newMonth);
        //console.log("currentY: ", newYear);
        //console.log(next7Days);
    };

    useEffect(() => {
        navigateMonth("", true)
    }, []);

    return (
        <div className="lg:w-full md:w-9/12 sm:w-10/12 mx-auto py-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-gray-700">
                    <button className="text-white" onClick={() => navigateMonth("prev", false)}>
                        <ChevronLeft />
                    </button>
                    <h2 id="currentMonth" className="text-white">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>
                    <button className="text-white" onClick={() => navigateMonth("next", false)}>
                        <ChevronRight />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 p-4">
                    {weekDays.map((d: string, index: number) => (
                        <div className="text-center border cursor-pointer bg-blue-300" key={d+index.toString()}>{d}</div>
                    ))}
                    {daysInMonth.map((day: string, index: number) => (
                        <div
                            key={day+index.toString()}
                            className={
                                rentArray.rented.includes(
                                    day.toString() + "-" + (currentMonth + 1).toString() + "-" + currentYear.toString()
                                )
                                    ? "text-center py-2 border cursor-pointer bg-red-400"
                                    : rentArray.hold.includes(
                                        day.toString() +
                                        "-" +
                                        (currentMonth + 1).toString() +
                                        "-" +
                                        currentYear.toString()
                                    )
                                        ? "text-center py-2 border cursor-pointer bg-orange-400"
                                        : "text-center py-2 border cursor-pointer bg-lime-400"
                            }
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}